import type { ErrorRequestHandler } from 'express';

export interface ApiError extends Error {
  code?: string;
  status?: number;
  details?: unknown;
}

export const errorHandler: ErrorRequestHandler = (err: ApiError, _req, res, _next) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  console.error(`[ERROR] ${code}: ${message}`, err.stack);

  const errorResponse: { code: string; message: string; details?: unknown } = {
    code,
    message,
  };

  if (err.details !== undefined) {
    errorResponse.details = err.details;
  }

  res.status(status).json({ error: errorResponse });
};

export function createError(
  message: string,
  code: string,
  status: number,
  details?: unknown
): ApiError {
  const error = new Error(message) as ApiError;
  error.code = code;
  error.status = status;
  error.details = details;
  return error;
}
