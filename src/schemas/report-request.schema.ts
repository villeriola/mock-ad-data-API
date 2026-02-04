import { z } from 'zod';
import { ALL_METRIC_NAMES, DIMENSION_NAMES } from '../models/index.js';

// Date format validation (YYYY-MM-DD)
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// Date range schema with validation
const dateRangeSchema = z
  .object({
    startDate: dateString,
    endDate: dateString,
  })
  .refine(
    (data) => new Date(data.startDate) <= new Date(data.endDate),
    { message: 'startDate must be before or equal to endDate' }
  );

// Filters schema
const filtersSchema = z.object({
  campaignIds: z.array(z.string()).optional(),
  adGroupIds: z.array(z.string()).optional(),
  campaignStatus: z.enum(['ENABLED', 'PAUSED', 'REMOVED']).optional(),
  adGroupStatus: z.enum(['ENABLED', 'PAUSED', 'REMOVED']).optional(),
});

// Order by schema
const orderBySchema = z.object({
  field: z.string(),
  direction: z.enum(['ASC', 'DESC']),
});

// Main report request schema
export const reportRequestSchema = z.object({
  accountId: z
    .string()
    .min(1, 'accountId is required')
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'accountId must be in format XXX-XXX-XXXX'),
  dateRange: dateRangeSchema,
  dimensions: z.array(z.enum(DIMENSION_NAMES)).optional(),
  metrics: z.array(z.enum(ALL_METRIC_NAMES)).optional(),
  filters: filtersSchema.optional(),
  pageSize: z.number().int().min(1).max(10000).optional().default(1000),
  pageToken: z.string().optional(),
  orderBy: orderBySchema.optional(),
});

export type ValidatedReportRequest = z.infer<typeof reportRequestSchema>;
