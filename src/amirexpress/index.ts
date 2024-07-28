import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { RequestHandler } from './types/RequestHandler.js';
import { Request } from './types/Request.js';
import { Response } from './implementations/Response.js';
import { Route } from './types/Route.js';

class AmirExpress {
  private middlewares: { path?: string; handler: RequestHandler }[];
  private routes: Record<string, Route[]>;

  constructor() {
    this.middlewares = [];
    this.routes = {
      get: [],
      post: [],
      put: [],
      delete: []
    };
  }

  public use(handler: RequestHandler): void;
  public use(path: string, handler: RequestHandler): void;

  public use(pathOrHandler: string | RequestHandler, handler?: RequestHandler): void {
    if (typeof pathOrHandler === 'string' && handler) {
      this.middlewares.push({ path: pathOrHandler, handler });
    } else if (typeof pathOrHandler === 'function') {
      this.middlewares.push({ handler: pathOrHandler });
    }
  }

  // public all(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void {
  //   const allHandlers = [handler, ...handlers];
  //   this.addRoute('get', path, allHandlers);
  //   this.addRoute('post', path, allHandlers);
  //   this.addRoute('put', path, allHandlers);
  //   this.addRoute('delete', path, allHandlers);
  // }

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
    const applicableMiddlewares = this.middlewares.filter(
      (mw) => !mw.path || path.startsWith(mw.path)
    );
    const allHandlers = [...applicableMiddlewares.map((mw) => mw.handler), ...handlers];
    this.routes[method].push({ path, handlers: allHandlers });
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
    // Implementation for handling requests goes here
  }
}

export function amirexpress(): AmirExpress {
  return new AmirExpress();
}
