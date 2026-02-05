import type { RequestHandler } from 'express';
import { reportRequestSchema } from '../schemas/report-request.schema.js';
import { generateReport } from '../services/report.service.js';
import { createError } from '../middleware/error-handler.js';
import { ZodError } from 'zod';

export const getReport: RequestHandler = async (req, res, next) => {
  try {
    // Merge URL params and query params for validation
    const raw = { accountId: req.params.accountId, ...req.query };
    const validated = reportRequestSchema.parse(raw);
    const report = await generateReport(validated);
    res.json({ authentication: res.locals.authStatus, ...report });
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return next(createError('Invalid request parameters', 'INVALID_REQUEST', 400, details));
    }
    next(error);
  }
};
