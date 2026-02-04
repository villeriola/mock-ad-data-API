import { Router } from 'express';
import { createReport } from '../controllers/reports.controller.js';
import { validateBody } from '../middleware/validate-request.js';
import { reportRequestSchema } from '../schemas/report-request.schema.js';

const router = Router();

router.post('/reports', validateBody(reportRequestSchema), createReport);

export default router;
