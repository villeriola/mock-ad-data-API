import { z } from 'zod';
import { ALL_METRIC_NAMES, DIMENSION_NAMES } from '../models/index.js';

// Date format validation (YYYY-MM-DD)
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// Helper: parse comma-separated string into array
const commaSeparated = z
  .string()
  .transform((val) => val.split(',').map((s) => s.trim()))
  .pipe(z.array(z.string()));

// Main report request schema (from query params + URL params)
export const reportRequestSchema = z
  .object({
    accountId: z
      .string()
      .min(1, 'accountId is required')
      .regex(/^\d{3}-\d{3}-\d{4}$/, 'accountId must be in format XXX-XXX-XXXX'),
    startDate: dateString,
    endDate: dateString,
    dimensions: commaSeparated.pipe(z.array(z.enum(DIMENSION_NAMES))).optional(),
    metrics: commaSeparated.pipe(z.array(z.enum(ALL_METRIC_NAMES))).optional(),
    pageSize: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().min(1).max(10000))
      .optional(),
    pageToken: z.string().optional(),
    orderBy: z.string().optional(),
    orderDirection: z.enum(['ASC', 'DESC']).optional(),
    // Filters
    campaignIds: commaSeparated.optional(),
    adGroupIds: commaSeparated.optional(),
    campaignStatus: z.enum(['ENABLED', 'PAUSED', 'REMOVED']).optional(),
    adGroupStatus: z.enum(['ENABLED', 'PAUSED', 'REMOVED']).optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'startDate must be before or equal to endDate',
  });

export type ValidatedReportRequest = z.infer<typeof reportRequestSchema>;
