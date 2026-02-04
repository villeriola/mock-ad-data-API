import type { MetricName } from './metrics.model.js';

// Supported dimensions
export const DIMENSION_NAMES = [
  'date',
  'campaign',
  'adGroup',
  'keyword',
  'device',
  'network',
] as const;

export type DimensionName = (typeof DIMENSION_NAMES)[number];

// Device and Network types
export type Device = 'MOBILE' | 'DESKTOP' | 'TABLET';
export type Network = 'SEARCH' | 'DISPLAY' | 'YOUTUBE';

// Request types
export interface DateRange {
  startDate: string; // ISO format: "2024-01-01"
  endDate: string;
}

export interface ReportRequest {
  accountId: string;
  dateRange: DateRange;
  dimensions?: DimensionName[];
  metrics?: MetricName[];
  filters?: ReportFilters;
  pageSize?: number;
  pageToken?: string;
  orderBy?: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
}

export interface ReportFilters {
  campaignIds?: string[];
  adGroupIds?: string[];
  campaignStatus?: 'ENABLED' | 'PAUSED' | 'REMOVED';
  adGroupStatus?: 'ENABLED' | 'PAUSED' | 'REMOVED';
}

// Response types
export interface ReportMetadata {
  accountId: string;
  accountName: string;
  dateRange: DateRange;
  dimensions: DimensionName[];
  metrics: MetricName[];
  totalRows: number;
  generatedAt: string;
}

export interface DimensionValues {
  date?: string;
  campaign?: {
    id: string;
    name: string;
    status: string;
  };
  adGroup?: {
    id: string;
    name: string;
    status: string;
    campaignId: string;
  };
  keyword?: {
    id: string;
    text: string;
    matchType: string;
    adGroupId: string;
  };
  device?: Device;
  network?: Network;
}

export interface ReportRow {
  dimensions: DimensionValues;
  metrics: Partial<Record<MetricName, number>>;
}

export interface ReportResponse {
  metadata: ReportMetadata;
  rows: ReportRow[];
  nextPageToken?: string;
}
