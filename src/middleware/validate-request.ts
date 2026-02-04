import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { createError } from './error-handler.js';

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        next(createError('Invalid request body', 'INVALID_REQUEST', 400, details));
      } else {
        next(error);
      }
    }
  };
}
