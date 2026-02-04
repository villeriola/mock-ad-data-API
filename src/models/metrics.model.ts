// Base metrics that are generated
export interface BaseMetrics {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
}

// Derived metrics calculated from base metrics
export interface DerivedMetrics {
  ctr: number; // Click-through rate (%)
  cpc: number; // Cost per click
  cpm: number; // Cost per thousand impressions
  conversionRate: number; // Conversion rate (%)
  costPerConversion: number;
  roas: number; // Return on ad spend
}

// All metrics combined
export type FullMetrics = BaseMetrics & DerivedMetrics;

// Metric names for type safety
export const BASE_METRIC_NAMES = [
  'impressions',
  'clicks',
  'cost',
  'conversions',
  'conversionValue',
] as const;

export const DERIVED_METRIC_NAMES = [
  'ctr',
  'cpc',
  'cpm',
  'conversionRate',
  'costPerConversion',
  'roas',
] as const;

export const ALL_METRIC_NAMES = [...BASE_METRIC_NAMES, ...DERIVED_METRIC_NAMES] as const;

export type MetricName = (typeof ALL_METRIC_NAMES)[number];
