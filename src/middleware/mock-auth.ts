import type { RequestHandler } from 'express';

export interface AuthStatus {
  authenticated: boolean;
  message: string;
}

export const mockAuth: RequestHandler = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey && typeof apiKey === 'string' && apiKey.length > 0) {
    res.locals.authStatus = {
      authenticated: true,
      message: 'Authenticated successfully',
    } satisfies AuthStatus;
  } else {
    res.locals.authStatus = {
      authenticated: false,
      message: 'Missing x-api-key header. Provide any string value to authenticate.',
    } satisfies AuthStatus;
  }

  next();
};
