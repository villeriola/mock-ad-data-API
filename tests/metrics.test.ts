import { describe, it, expect } from 'vitest';
import {
  generateBaseMetrics,
  calculateDerivedMetrics,
  aggregateMetrics,
  type MetricsContext,
} from '../src/generators/metrics.generator.js';

const createContext = (overrides: Partial<MetricsContext> = {}): MetricsContext => ({
  accountId: '123-456-7890',
  campaignId: 'camp_001',
  adGroupId: 'ag_001',
  date: '2024-01-15',
  device: 'DESKTOP',
  network: 'SEARCH',
  industry: 'ecommerce',
  campaignType: 'SEARCH',
  ...overrides,
});

describe('generateBaseMetrics', () => {
  it('produces consistent results for same context', () => {
    const ctx = createContext();

    const metrics1 = generateBaseMetrics(ctx);
    const metrics2 = generateBaseMetrics(ctx);

    expect(metrics1).toEqual(metrics2);
  });

  it('produces different results for different dates', () => {
    const ctx1 = createContext({ date: '2024-01-15' });
    const ctx2 = createContext({ date: '2024-01-16' });

    const metrics1 = generateBaseMetrics(ctx1);
    const metrics2 = generateBaseMetrics(ctx2);

    expect(metrics1.impressions).not.toEqual(metrics2.impressions);
  });

  it('maintains constraint: clicks <= impressions', () => {
    const dates = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'];
    const devices = ['DESKTOP', 'MOBILE', 'TABLET'] as const;

    for (const date of dates) {
      for (const device of devices) {
        const ctx = createContext({ date, device });
        const metrics = generateBaseMetrics(ctx);

        expect(metrics.clicks).toBeLessThanOrEqual(metrics.impressions);
      }
    }
  });

  it('maintains constraint: conversions <= clicks', () => {
    const dates = ['2024-01-01', '2024-01-02', '2024-01-03'];

    for (const date of dates) {
      const ctx = createContext({ date });
      const metrics = generateBaseMetrics(ctx);

      expect(metrics.conversions).toBeLessThanOrEqual(metrics.clicks);
    }
  });

  it('produces non-negative values', () => {
    const ctx = createContext();
    const metrics = generateBaseMetrics(ctx);

    expect(metrics.impressions).toBeGreaterThanOrEqual(0);
    expect(metrics.clicks).toBeGreaterThanOrEqual(0);
    expect(metrics.cost).toBeGreaterThanOrEqual(0);
    expect(metrics.conversions).toBeGreaterThanOrEqual(0);
    expect(metrics.conversionValue).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateDerivedMetrics', () => {
  it('calculates CTR correctly', () => {
    const base = {
      impressions: 1000,
      clicks: 50,
      cost: 100,
      conversions: 5,
      conversionValue: 500,
    };

    const full = calculateDerivedMetrics(base);

    expect(full.ctr).toEqual(5); // 50/1000 * 100 = 5%
  });

  it('calculates CPC correctly', () => {
    const base = {
      impressions: 1000,
      clicks: 50,
      cost: 100,
      conversions: 5,
      conversionValue: 500,
    };

    const full = calculateDerivedMetrics(base);

    expect(full.cpc).toEqual(2); // 100/50 = 2
  });

  it('calculates ROAS correctly', () => {
    const base = {
      impressions: 1000,
      clicks: 50,
      cost: 100,
      conversions: 5,
      conversionValue: 500,
    };

    const full = calculateDerivedMetrics(base);

    expect(full.roas).toEqual(5); // 500/100 = 5
  });

  it('handles zero denominators gracefully', () => {
    const base = {
      impressions: 0,
      clicks: 0,
      cost: 0,
      conversions: 0,
      conversionValue: 0,
    };

    const full = calculateDerivedMetrics(base);

    expect(full.ctr).toEqual(0);
    expect(full.cpc).toEqual(0);
    expect(full.roas).toEqual(0);
  });
});

describe('aggregateMetrics', () => {
  it('sums base metrics correctly', () => {
    const metrics = [
      { impressions: 100, clicks: 10, cost: 20, conversions: 2, conversionValue: 50 },
      { impressions: 200, clicks: 15, cost: 30, conversions: 3, conversionValue: 75 },
      { impressions: 150, clicks: 12, cost: 25, conversions: 1, conversionValue: 25 },
    ];

    const aggregated = aggregateMetrics(metrics);

    expect(aggregated.impressions).toEqual(450);
    expect(aggregated.clicks).toEqual(37);
    expect(aggregated.cost).toEqual(75);
    expect(aggregated.conversions).toEqual(6);
    expect(aggregated.conversionValue).toEqual(150);
  });

  it('returns zeros for empty array', () => {
    const aggregated = aggregateMetrics([]);

    expect(aggregated.impressions).toEqual(0);
    expect(aggregated.clicks).toEqual(0);
    expect(aggregated.cost).toEqual(0);
  });
});
