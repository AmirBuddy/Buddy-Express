import { EnhancedRequest } from './request.js';
import { EnhancedResponse } from './response.js';
import { Middleware, NextFunction } from './types/middleware.js';

/**
 * Example middleware to parse query parameters.
 */
export const queryParser: Middleware = (
  req: EnhancedRequest,
  res: EnhancedResponse,
  next: NextFunction
) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  req.query = Object.fromEntries(url.searchParams.entries());
  next();
};
