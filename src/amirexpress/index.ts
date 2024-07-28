import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { RequestHandler } from './types/RequestHandler.js';
import { Route } from './types/Route.js';

class AmirExpress {
  private globalMiddlewares: RequestHandler[];
  /**
   * We should have a data structure here for our routes when they are being added.
   * As we only have insertion to this data structure, we should have an index for each route
   * indicating it's insertion order. Items of this data structure should be categorized by their methods.
   */
  private routes: Record<string, Route[]>;

  constructor() {
    this.globalMiddlewares = [];
    this.routes = {
      get: [],
      post: [],
      put: [],
      delete: []
    };
  }

  public use(handler: RequestHandler): void {
    this.globalMiddlewares.push(handler);
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
    const allHandlers = [...this.globalMiddlewares, ...handlers];
    this.routes[method].push({ path, handlers: allHandlers });
  }

  public listen(port: number, callback?: () => void): void {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {});
    server.listen(port, callback);
  }
}

export function amirexpress(): AmirExpress {
  return new AmirExpress();
}
