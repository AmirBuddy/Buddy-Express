/* eslint-disable @typescript-eslint/no-unused-vars */
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { RequestHandler } from './types/RequestHandler.js';
import { Request } from './types/Request.js';
import { Response } from './implementations/Response.js';
import { Route } from './types/Route.js';
import { NextFunction } from './types/NextFunction.js';

class AmirExpress {
  private orderedRoutes: Route[];

  constructor() {
    this.orderedRoutes = [];
  }

  public use(handler: RequestHandler): void;
  public use(path: string, handler: RequestHandler): void;

  public use(pathOrHandler: string | RequestHandler, handler?: RequestHandler): void {
    if (typeof pathOrHandler === 'string' && handler) {
      this.orderedRoutes.push({
        method: 'all',
        path: pathOrHandler,
        handlers: [handler]
      });
    } else if (typeof pathOrHandler === 'function') {
      this.orderedRoutes.push({
        method: 'all',
        path: '*',
        handlers: [pathOrHandler]
      });
    }
  }

  public all(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void {
    const allHandlers = [handler, ...handlers];
    this.addRoute('all', path, allHandlers);
  }

  public get(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void {
    const allHandlers = [handler, ...handlers];
    this.addRoute('get', path, allHandlers);
  }

  public post(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): void {
    const allHandlers = [handler, ...handlers];
    this.addRoute('post', path, allHandlers);
  }

  public put(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void {
    const allHandlers = [handler, ...handlers];
    this.addRoute('put', path, allHandlers);
  }

  public delete(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): void {
    const allHandlers = [handler, ...handlers];
    this.addRoute('delete', path, allHandlers);
  }

  private addRoute(method: string, path: string, handlers: RequestHandler[]): void {
    this.orderedRoutes.push({ method, path, handlers });
  }

  public listen(port: number, callback?: () => void): void {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const request = req as Request;
      const response = new Response(req);
      this.handleRequest(request, response);
    });
    server.listen(port, callback);
  }

  private async handleRequest(req: Request, res: Response): Promise<void> {
    const { method, url } = req;

    // Extract all the handlers that this request should go through them

    // Check if there is any handler, if no send 404

    // Implement the mechanism for next function and calling the handlers in order
  }
}

export function amirexpress(): AmirExpress {
  return new AmirExpress();
}

export { Request, Response, NextFunction, RequestHandler, Route };
