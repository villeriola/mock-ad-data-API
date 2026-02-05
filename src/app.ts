import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/health.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import accountsRoutes from './routes/accounts.routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { mockAuth } from './middleware/mock-auth.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());

// Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/gads', mockAuth, reportsRoutes);
app.use('/api/v1/gads', mockAuth, accountsRoutes);

// Error handling
app.use(errorHandler);

export default app;
