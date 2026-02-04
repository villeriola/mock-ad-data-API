import type { BaseMetrics, FullMetrics } from '../models/index.js';
import type { Device, Network } from '../models/report.model.js';
import { SeededRandom, createSeed } from '../utils/seeded-random.js';
import { getBenchmarks, type MetricBenchmarks } from '../data/industry-benchmarks.js';
import type { Industry } from '../data/accounts.js';
import type { CampaignType } from '../models/index.js';

export interface MetricsContext {
  accountId: string;
  campaignId: string;
  adGroupId: string;
  keywordId?: string;
  date: string;
  device: Device;
  network: Network;
  industry: Industry;
  campaignType: CampaignType;
}

// Device traffic distribution
const DEVICE_WEIGHTS: Record<Device, number> = {
  MOBILE: 0.55,
  DESKTOP: 0.35,
  TABLET: 0.1,
};

// Network traffic distribution
const NETWORK_WEIGHTS: Record<Network, number> = {
  SEARCH: 0.7,
  DISPLAY: 0.25,
  YOUTUBE: 0.05,
};

export function generateBaseMetrics(ctx: MetricsContext): BaseMetrics {
  const seed = createSeed(
    ctx.accountId,
    ctx.campaignId,
    ctx.adGroupId,
    ctx.keywordId || 'all',
    ctx.date,
    ctx.device,
    ctx.network
  );
  const rng = new SeededRandom(seed);
  const benchmarks = getBenchmarks(ctx.industry, ctx.campaignType);

  // Get day of week for variance
  const dayOfWeek = new Date(ctx.date).getDay();

  // Calculate base impressions with device and network weighting
  const deviceMultiplier = DEVICE_WEIGHTS[ctx.device];
  const networkMultiplier = NETWORK_WEIGHTS[ctx.network];

  let impressions = Math.round(
    rng.gaussian(
      benchmarks.avgDailyImpressions * deviceMultiplier * networkMultiplier,
      benchmarks.avgDailyImpressions * benchmarks.impressionVariance * deviceMultiplier * networkMultiplier
    )
  );

  // Apply day-of-week variance
  impressions = Math.round(rng.withDayOfWeekVariance(impressions, dayOfWeek, 1.15));
  impressions = Math.max(0, impressions);

  // Generate CTR and calculate clicks
  const ctr = rng.float(benchmarks.minCtr, benchmarks.maxCtr) / 100;
  let clicks = Math.round(impressions * ctr);
  clicks = Math.min(clicks, impressions); // Ensure clicks <= impressions

  // Generate CPC and calculate cost
  const cpc = rng.float(benchmarks.minCpc, benchmarks.maxCpc);
  const cost = Math.round(clicks * cpc * 100) / 100;

  // Generate conversion rate and calculate conversions
  const conversionRate = rng.float(benchmarks.minConversionRate, benchmarks.maxConversionRate) / 100;
  let conversions = Math.round(clicks * conversionRate);
  conversions = Math.min(conversions, clicks); // Ensure conversions <= clicks

  // Generate AOV and calculate conversion value
  const aov = rng.float(benchmarks.minAov, benchmarks.maxAov);
  const conversionValue = Math.round(conversions * aov * 100) / 100;

  return {
    impressions,
    clicks,
    cost,
    conversions,
    conversionValue,
  };
}

export function calculateDerivedMetrics(base: BaseMetrics): FullMetrics {
  const { impressions, clicks, cost, conversions, conversionValue } = base;

  return {
    ...base,
    ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
    cpc: clicks > 0 ? Math.round((cost / clicks) * 100) / 100 : 0,
    cpm: impressions > 0 ? Math.round((cost / impressions) * 1000 * 100) / 100 : 0,
    conversionRate: clicks > 0 ? Math.round((conversions / clicks) * 10000) / 100 : 0,
    costPerConversion: conversions > 0 ? Math.round((cost / conversions) * 100) / 100 : 0,
    roas: cost > 0 ? Math.round((conversionValue / cost) * 100) / 100 : 0,
  };
}

export function aggregateMetrics(metricsArray: BaseMetrics[]): BaseMetrics {
  return metricsArray.reduce(
    (acc, metrics) => ({
      impressions: acc.impressions + metrics.impressions,
      clicks: acc.clicks + metrics.clicks,
      cost: Math.round((acc.cost + metrics.cost) * 100) / 100,
      conversions: acc.conversions + metrics.conversions,
      conversionValue: Math.round((acc.conversionValue + metrics.conversionValue) * 100) / 100,
    }),
    { impressions: 0, clicks: 0, cost: 0, conversions: 0, conversionValue: 0 }
  );
}

// All possible devices and networks for iteration
export const ALL_DEVICES: Device[] = ['MOBILE', 'DESKTOP', 'TABLET'];
export const ALL_NETWORKS: Network[] = ['SEARCH', 'DISPLAY', 'YOUTUBE'];
