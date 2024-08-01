/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { join, normalize } from 'node:path';
import fs from 'fs-extra';
import {
  ErrorHandler,
  NextHandler,
  RequestHandler,
  SimpleHandler,
  Request,
  Response,
  Route,
  NextFunction
} from './types';

class BuddyExpress {
  private requestRouter: Route[];

  constructor() {
    this.requestRouter = [];
  }

  public use(handler: RequestHandler): void;
  public use(path: string, handler: RequestHandler): void;
  public use(pathOrHandler: string | RequestHandler, handler?: RequestHandler): void {
    if (typeof pathOrHandler === 'string' && handler) {
      this.requestRouter.push({
        method: 'all',
        path: pathOrHandler,
        handlers: [handler]
      });
    } else if (typeof pathOrHandler === 'function') {
      this.requestRouter.push({
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

  public patch(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): void {
    const allHandlers = [handler, ...handlers];
    this.addRoute('patch', path, allHandlers);
  }

  private addRoute(method: string, path: string, handlers: RequestHandler[]): void {
    this.requestRouter.push({ method, path, handlers });
  }

  public static(root: string): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // normalize the pathname, it may have a path for the file request and that should be handled
        const parsedUrl = parse(req.url as string, true);
        const tempPath = parsedUrl.pathname!;
        const segments = tempPath.split('/');
        const lastSegment = segments[segments.length - 1];
        const pathname = decodeURIComponent(lastSegment);
        const filePath = normalize(join(root, pathname));

        if (!filePath.startsWith(root)) {
          return next(new Error('File Path Is Not Correct'));
        }

        const fileExists = await fs.pathExists(filePath);
        const stats = await fs.stat(filePath);
        if (!fileExists || stats.isDirectory()) {
          return next(new Error("File Doesn't Exist"));
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
    const server = createServer((req: IncomingMessage, res: ServerResponse): void => {
      const request = req as Request;
      const response = res as Response;
      this.mountMethods(response, res);
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

    // normalize the pathname, it may have a file request and that should be handled
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
    const matchingRoutes = this.requestRouter.filter(
      (route) =>
        (route.method === (method as string).toLowerCase() || route.method === 'all') &&
        this.checkPath(route.path, modifiedPathname!, req)
    );

    if (matchingRoutes.length === 0) {
      if (!res.writableEnded) {
        res.status(404);
        res.send('Not Found');
      }
      return;
    }

    // Constructing the handlers that the request should go through
    const handlers: RequestHandler[] = matchingRoutes.flatMap((route) => route.handlers);

    // Execute handlers sequentially (except for the error handler that will be executed without order)
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

  private mountMethods(response: Response, res: ServerResponse) {
    response.status = (code: number) => {
      res.statusCode = code;
    };

    response.json = (data: any) => {
      if (!res.hasHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify(data));
    };

    response.redirect = (url: string) => {
      res.statusCode = 302;
      res.setHeader('Location', url);
      res.end(`Redirecting to ${url}`);
    };

    response.send = (data: any) => {
      if (typeof data === 'object' && !Buffer.isBuffer(data)) {
        if (!res.hasHeader('Content-Type')) {
          res.setHeader('Content-Type', 'application/json');
        }
        res.end(JSON.stringify(data));
      } else {
        if (!res.hasHeader('Content-Type')) {
          res.setHeader(
            'Content-Type',
            Buffer.isBuffer(data) ? 'application/octet-stream' : 'text/plain'
          );
        }
        res.end(data);
      }
    };
  }

  private checkPath(path: string, reqPath: string, req: Request): boolean {
    if (!path.includes(':')) {
      return path === reqPath || path === '*';
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

  public json(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const contentType = req.headers['content-type'];
      if (!(contentType && contentType.includes('application/json'))) {
        return next();
      }
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        if (body) {
          try {
            req.body = JSON.parse(body);
          } catch (e) {
            return next(e);
          }
        }
        next();
      });
    };
  }
}

export function buddyexpress(): BuddyExpress {
  return new BuddyExpress();
}

export { Request, Response, NextFunction, RequestHandler };
