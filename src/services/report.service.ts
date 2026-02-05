import type {
  ReportResponse,
  ReportRow,
  DimensionValues,
  DimensionName,
  MetricName,
  Device,
  Network,
} from '../models/index.js';
import { ALL_METRIC_NAMES, DIMENSION_NAMES } from '../models/index.js';
import type { ValidatedReportRequest } from '../schemas/report-request.schema.js';
import { getAccountStructure } from '../generators/account.generator.js';
import {
  generateBaseMetrics,
  calculateDerivedMetrics,
  aggregateMetrics,
  ALL_DEVICES,
  ALL_NETWORKS,
  type MetricsContext,
} from '../generators/metrics.generator.js';
import { expandDateRange } from '../utils/date-utils.js';
import { createError } from '../middleware/error-handler.js';

interface RawDataPoint {
  date: string;
  campaignId: string;
  adGroupId: string;
  keywordId: string;
  device: Device;
  network: Network;
  metrics: ReturnType<typeof generateBaseMetrics>;
}

export async function generateReport(request: ValidatedReportRequest): Promise<ReportResponse> {
  // Get account structure
  const structure = getAccountStructure(request.accountId);
  if (!structure) {
    throw createError(`Account not found: ${request.accountId}`, 'ACCOUNT_NOT_FOUND', 404);
  }

  const { account, campaigns, adGroups, keywords } = structure;

  // Determine which dimensions and metrics to use
  const dimensions = request.dimensions || [];
  const metrics = request.metrics || [...ALL_METRIC_NAMES];

  // Expand date range
  const dates = expandDateRange(request.startDate, request.endDate);

  // Generate raw data at the finest granularity
  const rawData: RawDataPoint[] = [];

  for (const date of dates) {
    for (const campaign of campaigns) {
      // Apply campaign filters
      if (request.campaignIds && !request.campaignIds.includes(campaign.id)) {
        continue;
      }
      if (request.campaignStatus && campaign.status !== request.campaignStatus) {
        continue;
      }

      // Skip removed campaigns unless explicitly filtered
      if (campaign.status === 'REMOVED' && !request.campaignStatus) {
        continue;
      }

      const campaignAdGroups = adGroups.filter((ag) => ag.campaignId === campaign.id);

      for (const adGroup of campaignAdGroups) {
        // Apply ad group filters
        if (request.adGroupIds && !request.adGroupIds.includes(adGroup.id)) {
          continue;
        }
        if (request.adGroupStatus && adGroup.status !== request.adGroupStatus) {
          continue;
        }

        // Skip removed ad groups unless explicitly filtered
        if (adGroup.status === 'REMOVED' && !request.adGroupStatus) {
          continue;
        }

        const adGroupKeywords = keywords.filter((kw) => kw.adGroupId === adGroup.id);

        for (const keyword of adGroupKeywords) {
          // Skip removed keywords
          if (keyword.status === 'REMOVED') {
            continue;
          }

          for (const device of ALL_DEVICES) {
            for (const network of ALL_NETWORKS) {
              const ctx: MetricsContext = {
                accountId: account.id,
                campaignId: campaign.id,
                adGroupId: adGroup.id,
                keywordId: keyword.id,
                date,
                device,
                network,
                industry: account.industry,
                campaignType: campaign.type,
              };

              const metricsData = generateBaseMetrics(ctx);

              rawData.push({
                date,
                campaignId: campaign.id,
                adGroupId: adGroup.id,
                keywordId: keyword.id,
                device,
                network,
                metrics: metricsData,
              });
            }
          }
        }
      }
    }
  }

  // Aggregate by requested dimensions
  const aggregatedData = aggregateByDimensions(rawData, dimensions, structure);

  // Build response rows
  const rows: ReportRow[] = aggregatedData.map((item) => {
    const fullMetrics = calculateDerivedMetrics(item.metrics);

    // Filter to only requested metrics
    const filteredMetrics: Partial<Record<MetricName, number>> = {};
    for (const metric of metrics) {
      filteredMetrics[metric] = fullMetrics[metric];
    }

    return {
      dimensions: item.dimensions,
      metrics: filteredMetrics,
    };
  });

  // Apply sorting
  if (request.orderBy) {
    const field = request.orderBy;
    const direction = request.orderDirection || 'DESC';
    rows.sort((a, b) => {
      const aVal = (a.metrics as Record<string, number>)[field] || 0;
      const bVal = (b.metrics as Record<string, number>)[field] || 0;
      return direction === 'ASC' ? aVal - bVal : bVal - aVal;
    });
  }

  // Apply pagination
  const pageSize = request.pageSize || 1000;
  const startIndex = request.pageToken ? parseInt(request.pageToken, 10) : 0;
  const paginatedRows = rows.slice(startIndex, startIndex + pageSize);
  const nextPageToken =
    startIndex + pageSize < rows.length ? String(startIndex + pageSize) : undefined;

  return {
    metadata: {
      accountId: account.id,
      accountName: account.name,
      dateRange: {
        startDate: request.startDate,
        endDate: request.endDate,
      },
      dimensions,
      metrics,
      totalRows: rows.length,
      generatedAt: new Date().toISOString(),
    },
    rows: paginatedRows,
    nextPageToken,
  };
}

interface AggregatedItem {
  dimensions: DimensionValues;
  metrics: ReturnType<typeof generateBaseMetrics>;
}

function aggregateByDimensions(
  rawData: RawDataPoint[],
  dimensions: DimensionName[],
  structure: NonNullable<ReturnType<typeof getAccountStructure>>
): AggregatedItem[] {
  const { campaigns, adGroups, keywords } = structure;

  // Create lookup maps
  const campaignMap = new Map(campaigns.map((c) => [c.id, c]));
  const adGroupMap = new Map(adGroups.map((ag) => [ag.id, ag]));
  const keywordMap = new Map(keywords.map((kw) => [kw.id, kw]));

  // Group by dimension key
  const groups = new Map<string, RawDataPoint[]>();

  for (const dataPoint of rawData) {
    const key = buildDimensionKey(dataPoint, dimensions);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(dataPoint);
  }

  // Aggregate each group
  const results: AggregatedItem[] = [];

  for (const [_key, points] of groups) {
    const firstPoint = points[0];
    const dimensionValues: DimensionValues = {};

    // Build dimension values from first point (they're all the same within the group)
    if (dimensions.includes('date')) {
      dimensionValues.date = firstPoint.date;
    }
    if (dimensions.includes('campaign')) {
      const campaign = campaignMap.get(firstPoint.campaignId)!;
      dimensionValues.campaign = {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
      };
    }
    if (dimensions.includes('adGroup')) {
      const adGroup = adGroupMap.get(firstPoint.adGroupId)!;
      dimensionValues.adGroup = {
        id: adGroup.id,
        name: adGroup.name,
        status: adGroup.status,
        campaignId: adGroup.campaignId,
      };
    }
    if (dimensions.includes('keyword')) {
      const keyword = keywordMap.get(firstPoint.keywordId)!;
      dimensionValues.keyword = {
        id: keyword.id,
        text: keyword.text,
        matchType: keyword.matchType,
        adGroupId: keyword.adGroupId,
      };
    }
    if (dimensions.includes('device')) {
      dimensionValues.device = firstPoint.device;
    }
    if (dimensions.includes('network')) {
      dimensionValues.network = firstPoint.network;
    }

    // Aggregate metrics
    const aggregatedMetrics = aggregateMetrics(points.map((p) => p.metrics));

    results.push({
      dimensions: dimensionValues,
      metrics: aggregatedMetrics,
    });
  }

  return results;
}

function buildDimensionKey(dataPoint: RawDataPoint, dimensions: DimensionName[]): string {
  const parts: string[] = [];

  for (const dim of dimensions) {
    switch (dim) {
      case 'date':
        parts.push(dataPoint.date);
        break;
      case 'campaign':
        parts.push(dataPoint.campaignId);
        break;
      case 'adGroup':
        parts.push(dataPoint.adGroupId);
        break;
      case 'keyword':
        parts.push(dataPoint.keywordId);
        break;
      case 'device':
        parts.push(dataPoint.device);
        break;
      case 'network':
        parts.push(dataPoint.network);
        break;
    }
  }

  return parts.join('|');
}
