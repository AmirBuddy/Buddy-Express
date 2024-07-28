/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { Router } from './router.js';
import { Request } from './types/request.js';
import { Response } from './types/response.js';
import { Middleware, NextFunction } from './types/middleware.js';
import { RouteHandler } from './types/route.js';

class AmirExpress {
  private router: Router;
  private middlewares: Middleware[] = [];

  constructor() {
    this.router = new Router();
  }

  /**
   * Registers a middleware.
   * @param middleware - The middleware function.
   */
  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  /**
   * Starts the server.
   * @param port - The port number to listen on.
   */
  listen(port: number) {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const enhancedReq = req as Request;
      const enhancedRes = res as Response;

      // Add JSON response method
      enhancedRes.json = (data: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };

      // Add redirect response method
      enhancedRes.redirect = (url: string) => {
        res.statusCode = 302;
        res.setHeader('Location', url);
        res.end();
      };

      // Process middlewares
      const processMiddlewares = (index: number) => {
        if (index >= this.middlewares.length) {
          this.router.handle(enhancedReq, enhancedRes);
          return;
        }
        const next: NextFunction = () => processMiddlewares(index + 1);
        this.middlewares[index](enhancedReq, enhancedRes, next);
      };

      processMiddlewares(0);
    });

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  /**
   * Registers a route handler for GET requests.
   * @param url - The URL path.
   * @param handler - The route handler function.
   */
  get(url: string, handler: RouteHandler) {
    this.router.on('GET', url, handler);
  }

  /**
   * Registers a route handler for POST requests.
   * @param url - The URL path.
   * @param handler - The route handler function.
   */
  post(url: string, handler: RouteHandler) {
    this.router.on('POST', url, handler);
  }

  /**
   * Registers a route handler for PUT requests.
   * @param url - The URL path.
   * @param handler - The route handler function.
   */
  put(url: string, handler: RouteHandler) {
    this.router.on('PUT', url, handler);
  }

  /**
   * Registers a route handler for DELETE requests.
   * @param url - The URL path.
   * @param handler - The route handler function.
   */
  delete(url: string, handler: RouteHandler) {
    this.router.on('DELETE', url, handler);
  }
}

export const amirexpress = () => new AmirExpress();
