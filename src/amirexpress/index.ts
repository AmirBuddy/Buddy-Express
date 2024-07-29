/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'url';
import {
  ErrorHandler,
  NextHandler,
  RequestHandler,
  SimpleHandler
} from './types/RequestHandler.js';
import { Request } from './types/Request.js';
import { mountMethods, Response } from './implementations/Response.js';
import { Response as IResponse } from './types/Response.js';
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
      const response = res as IResponse;

      mountMethods(response, res);

      this.handleRequest(request, response);
    });
    server.listen(port, callback);
  }

  private async handleRequest(req: Request, res: Response): Promise<void> {
    const { method, url } = req;

    // Adding queries of the incoming request to req.query
    const parsedUrl = parse(url as string, true);
    req.query = {};
    for (const key in parsedUrl.query) {
      const value = parsedUrl.query[key];
      req.query[key] = Array.isArray(value) ? value.join(',') : value;
    }

    // Find matching routes
    const matchingRoutes = this.orderedRoutes.filter(
      (route) =>
        (route.method === (method as string).toLowerCase() || route.method === 'all') &&
        (route.path === parsedUrl.pathname || route.path === '*')
    );

    if (matchingRoutes.length === 0) {
      if (!res.writableEnded) {
        res.status(404);
        res.send('Not Found');
      }
      return;
    }

    // Flatten handlers from matching routes
    const handlers: RequestHandler[] = matchingRoutes.flatMap((route) => route.handlers);

    // Execute handlers sequentially
    let index = 0;
    const next: NextFunction = async (err?: any) => {
      if (err) {
        const errorHandler = handlers.find((handler) => handler.length === 4) as
          | ErrorHandler
          | undefined;
        if (errorHandler) {
          if (!res.writableEnded) {
            await errorHandler(err, req, res, next);
          }
        } else {
          if (!res.writableEnded) {
            res.status(500);
            res.send('Internal Server Error');
          }
        }
        return;
      }
      if (index >= handlers.length) {
        if (!res.writableEnded) {
          res.status(404);
          res.send('Not Found');
        }
        return;
      }

      const handler = handlers[index++];
      if (handler.length === 4) {
        next(err);
      } else if (handler.length === 3) {
        if (!res.writableEnded) {
          await (handler as NextHandler)(req, res, next);
        }
      } else {
        if (!res.writableEnded) {
          await (handler as SimpleHandler)(req, res);
        }
        next();
      }
    };

    next();
  }
}

export function amirexpress(): AmirExpress {
  return new AmirExpress();
}

export { Request, Response, NextFunction, RequestHandler, Route };
