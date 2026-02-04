import type { CampaignType } from '../models/index.js';
import type { Industry } from './accounts.js';

export interface MetricBenchmarks {
  avgDailyImpressions: number;
  impressionVariance: number; // Standard deviation as % of mean
  minCtr: number; // Percentage
  maxCtr: number;
  minCpc: number; // Dollars
  maxCpc: number;
  minConversionRate: number; // Percentage
  maxConversionRate: number;
  minAov: number; // Average order value
  maxAov: number;
}

// Base benchmarks by industry
const INDUSTRY_BENCHMARKS: Record<Industry, MetricBenchmarks> = {
  ecommerce: {
    avgDailyImpressions: 8000,
    impressionVariance: 0.3,
    minCtr: 1.5,
    maxCtr: 4.5,
    minCpc: 0.5,
    maxCpc: 2.5,
    minConversionRate: 2.0,
    maxConversionRate: 5.0,
    minAov: 50,
    maxAov: 200,
  },
  saas: {
    avgDailyImpressions: 5000,
    impressionVariance: 0.35,
    minCtr: 2.0,
    maxCtr: 5.0,
    minCpc: 2.0,
    maxCpc: 8.0,
    minConversionRate: 3.0,
    maxConversionRate: 8.0,
    minAov: 100,
    maxAov: 500,
  },
  local_services: {
    avgDailyImpressions: 3000,
    impressionVariance: 0.4,
    minCtr: 3.0,
    maxCtr: 7.0,
    minCpc: 3.0,
    maxCpc: 15.0,
    minConversionRate: 5.0,
    maxConversionRate: 12.0,
    minAov: 150,
    maxAov: 800,
  },
  travel: {
    avgDailyImpressions: 10000,
    impressionVariance: 0.35,
    minCtr: 2.0,
    maxCtr: 5.5,
    minCpc: 0.8,
    maxCpc: 3.0,
    minConversionRate: 1.5,
    maxConversionRate: 4.0,
    minAov: 500,
    maxAov: 3000,
  },
  finance: {
    avgDailyImpressions: 4000,
    impressionVariance: 0.3,
    minCtr: 2.5,
    maxCtr: 6.0,
    minCpc: 3.0,
    maxCpc: 20.0,
    minConversionRate: 2.0,
    maxConversionRate: 6.0,
    minAov: 200,
    maxAov: 2000,
  },
};

// Multipliers by campaign type
const CAMPAIGN_TYPE_MULTIPLIERS: Record<CampaignType, Partial<MetricBenchmarks>> = {
  SEARCH: {
    // Baseline - no modifications
  },
  DISPLAY: {
    avgDailyImpressions: 25000, // Display has much higher impressions
    minCtr: 0.1, // But much lower CTR
    maxCtr: 0.8,
    minCpc: 0.1, // And lower CPC
    maxCpc: 1.0,
  },
  VIDEO: {
    avgDailyImpressions: 15000,
    minCtr: 0.5,
    maxCtr: 2.0,
    minCpc: 0.05, // CPV model - very low
    maxCpc: 0.3,
  },
  SHOPPING: {
    avgDailyImpressions: 6000,
    minCtr: 1.0,
    maxCtr: 3.0,
    minConversionRate: 1.5,
    maxConversionRate: 4.0,
  },
};

export function getBenchmarks(industry: Industry, campaignType: CampaignType): MetricBenchmarks {
  const base = { ...INDUSTRY_BENCHMARKS[industry] };
  const typeModifiers = CAMPAIGN_TYPE_MULTIPLIERS[campaignType];

  return {
    ...base,
    ...typeModifiers,
  };
}
