/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'url';
import { join, normalize } from 'node:path';
import fs from 'fs-extra';
import {
  ErrorHandler,
  NextHandler,
  RequestHandler,
  SimpleHandler
} from './types/RequestHandler.js';
import { Request } from './types/Request.js';
import { mountMethods } from './implementations/Response.js';
import { Response } from './types/Response.js';
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

  public static(root: string): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const parsedUrl = parse(req.url as string, true);
        const tempPath = parsedUrl.pathname!;
        const segments = tempPath.split('/');
        const lastSegment = segments[segments.length - 1];
        const pathname = decodeURIComponent(lastSegment);
        const filePath = normalize(join(root, pathname));

        if (!filePath.startsWith(root)) {
          res.status(403);
          res.send('Forbidden');
          return;
        }

        const fileExists = await fs.pathExists(filePath);
        if (!fileExists) {
          return next(new Error("Doesn't Exist"));
        }

        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
          res.status(403);
          res.send('Forbidden');
          return;
        }

        res.status(200);
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        stream.on('end', () => res.end());
        stream.on('error', (err) => next(err));
      } catch (err) {
        next(err);
      }
    };
  }

  public listen(port: number, callback?: () => void): void {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const request = req as Request;
      const response = res as Response;

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
      req.query[key] = Array.isArray(value) ? value.join(',') : (value as string);
    }

    // normalize the pathname if, it may have a file request and that should be handled
    const pathname = parsedUrl.pathname!;
    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && lastSegment.includes('.')) {
      segments.pop();
    }
    let modifiedPathname = segments.join('/');
    if (!modifiedPathname.startsWith('/')) {
      modifiedPathname = '/' + modifiedPathname;
    }

    // Find matching routes
    const matchingRoutes = this.orderedRoutes.filter(
      (route) =>
        (route.method === (method as string).toLowerCase() || route.method === 'all') &&
        (this.checkPath(route.path, modifiedPathname!, req) || route.path === '*')
    );

    if (matchingRoutes.length === 0) {
      if (!res.writableEnded) {
        res.status(404);
        res.send('Not Found');
      }
      return;
    }

    // Constructing the responseRouter
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
          res.status(500);
          res.send('Internal Server Error');
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

  private checkPath(path: string, reqPath: string, req: Request): boolean {
    if (!path.includes(':')) {
      return path === reqPath;
    }

    const pathParts = path.split('/');
    const reqPathParts = reqPath.split('/');
    if (pathParts.length !== reqPathParts.length) return false;

    const params: Record<string, string> = {};
    for (let i: number = 0; i < pathParts.length; i++) {
      if (pathParts[i].startsWith(':')) {
        params[pathParts[i].substring(1)] = reqPathParts[i];
      } else if (pathParts[i] !== reqPathParts[i]) {
        return false;
      }
    }
    req.params = { ...params };
    return true;
  }
}

export function amirexpress(): AmirExpress {
  return new AmirExpress();
}

export { Request, Response, NextFunction, RequestHandler, Route };
