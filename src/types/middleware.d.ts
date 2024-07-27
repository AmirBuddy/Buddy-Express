import { EnhancedRequest } from './request';
import { EnhancedResponse } from './response';

export type NextFunction = () => void;

/**
 * A middleware function.
 * @param req - The incoming HTTP request.
 * @param res - The server response.
 * @param next - The next middleware function.
 */
export type Middleware = (
  req: EnhancedRequest,
  res: EnhancedResponse,
  next: NextFunction
) => void;
