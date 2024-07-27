import { EnhancedRequest } from '../request.ts';
import { EnhancedResponse } from '../response.ts';

/**
 * A handler for HTTP routes.
 * @param req - The incoming HTTP request.
 * @param res - The server response.
 */
export type RouteHandler = (req: EnhancedRequest, res: EnhancedResponse) => void;

/**
 * A route configuration.
 */
export interface Route {
  method: string;
  url: string;
  handler: RouteHandler;
}
