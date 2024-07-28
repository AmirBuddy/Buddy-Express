import { Route, RouteHandler } from './types/route.js';
import { Router as IRouter } from './types/router.js';
import { EnhancedRequest } from './request.js';
import { EnhancedResponse } from './response.js';

export class Router implements IRouter {
  private routes: Route[] = [];

  on(method: string, url: string, handler: RouteHandler): void {
    this.routes.push({ method, url, handler });
  }

  handle(req: EnhancedRequest, res: EnhancedResponse): void {
    const matchingRoute = this.routes.find(
      (route) => route.method === req.method && route.url === req.url
    );

    if (matchingRoute) {
      matchingRoute.handler(req, res);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  }
}
