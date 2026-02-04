import type { RequestHandler } from 'express';
import type { ValidatedReportRequest } from '../schemas/report-request.schema.js';
import { generateReport } from '../services/report.service.js';

export const createReport: RequestHandler = async (req, res, next) => {
  try {
    const request = req.body as ValidatedReportRequest;
    const report = await generateReport(request);
    res.json(report);
  } catch (error) {
    next(error);
  }
};
