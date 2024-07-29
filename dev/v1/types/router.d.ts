import { IncomingMessage, ServerResponse } from 'node:http';
import { RouteHandler } from './route';

/**
 * The router interface.
 */
export interface Router {
  /**
   * Registers a new route handler.
   * @param method - The HTTP method.
   * @param url - The URL path.
   * @param handler - The route handler function.
   */
  on(method: string, url: string, handler: RouteHandler): void;

  /**
   * Handles incoming HTTP requests.
   * @param req - The incoming HTTP request.
   * @param res - The server response.
   */
  handle(req: IncomingMessage, res: ServerResponse): void;
}
