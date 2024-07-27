import { IncomingMessage, ServerResponse } from 'node:http';
import { RouteHandler, Router as IRouter } from './types/router.js';

class Router implements IRouter {
  private routes: Record<string, RouteHandler> = {};

  public on(method: string, url: string, handler: RouteHandler): void {
    const routeKey = `${method.toUpperCase()} ${url}`;
    this.routes[routeKey] = handler;
  }

  public handle(req: IncomingMessage, res: ServerResponse): void {
    const routeKey = `${req.method} ${req.url}`;
    const handler = this.routes[routeKey];
    if (handler) {
      handler(req, res);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  }
}

export default Router;
