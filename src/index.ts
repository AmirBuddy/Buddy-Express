/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import {
  RequestHandler,
  SimpleHandler,
  NextHandler,
  ErrorHandler
} from './types/RequestHandler.js';
import { Request } from './types/Request.js';
import { Response } from './types/Response.js';
import { NextFunction } from './types/NextFunction.js';
import { IRoute } from './types/IRoute.js';

class AmirExpress {
  private requestHandlers: RequestHandler[] = [];
  private routes: IRoute[] = [];

  constructor() {}

  use(requestHandler: RequestHandler) {
    this.requestHandlers.push(requestHandler);
  }

  get(url: string, ...requestHandlers: RequestHandler[]) {
    this.routes.push({ method: 'GET', url, handlers: requestHandlers });
  }

  post(url: string, ...requestHandlers: RequestHandler[]) {
    this.routes.push({ method: 'POST', url, handlers: requestHandlers });
  }

  put(url: string, ...requestHandlers: RequestHandler[]) {
    this.routes.push({ method: 'PUT', url, handlers: requestHandlers });
  }

  delete(url: string, ...requestHandlers: RequestHandler[]) {
    this.routes.push({ method: 'DELETE', url, handlers: requestHandlers });
  }

  listen(port: number, callback?: () => void) {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const request = req as Request;
      const response = res as Response;

      // Execute global request handlers
      let idx = 0;
      const next: NextFunction = (err?: any) => {
        if (err) {
          return this.handleError(err, request, response);
        }
        if (idx >= this.requestHandlers.length) {
          this.handleRoute(request, response);
        } else {
          const handler = this.requestHandlers[idx++];
          this.executeHandler(handler, request, response, next);
        }
      };
      next();
    });

    server.listen(port, callback);
  }

  private handleRoute(request: Request, response: Response) {
    const { method, url } = request;
    const route = this.routes.find(
      (route) => route.method === method && route.url === url
    );

    if (route) {
      let idx = 0;
      const next: NextFunction = (err?: any) => {
        if (err) {
          return this.handleError(err, request, response);
        }
        if (idx >= route.handlers.length) {
          response.end();
        } else {
          const handler = route.handlers[idx++];
          this.executeHandler(handler, request, response, next);
        }
      };
      next();
    } else {
      response.statusCode = 404;
      response.end('Not Found');
    }
  }

  private handleError(err: any, request: Request, response: Response) {
    const errorHandler = this.requestHandlers.find(
      (handler) => (handler as ErrorHandler).length === 4
    );
    if (errorHandler) {
      (errorHandler as ErrorHandler)(err, request, response, () => {});
    } else {
      response.statusCode = 500;
      response.end('Internal Server Error');
    }
  }

  private executeHandler(
    handler: RequestHandler,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if ((handler as ErrorHandler).length === 4) {
      next(); // Skip error handlers in normal flow
    } else if ((handler as NextHandler).length === 3) {
      (handler as NextHandler)(request, response, next);
    } else {
      (handler as SimpleHandler)(request, response);
      next();
    }
  }
}

export const amirexpress = () => new AmirExpress();
