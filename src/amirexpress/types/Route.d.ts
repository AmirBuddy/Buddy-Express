import { RequestHandler } from './RequestHandler.js';

/**
 * The Route type defines the structure of a route object with method, path, and handlers
 * properties.
 * @property {string} method - The `method` property in the `Route` type represents the HTTP method
 * associated with the route, such as GET, POST, PUT, DELETE, etc.
 * @property {string} path - The `path` property in the `Route` type represents the URL path for which
 * the route is defined. It specifies the endpoint at which the route will be accessible.
 * @property {RequestHandler[]} handlers - The `handlers` property in the `Route` type represents an
 * array of `RequestHandler` functions that will be executed when the route is matched. Each
 * `RequestHandler` function typically handles a specific aspect of processing the incoming request and
 * generating the response.
 */
export type Route = {
  method: string;
  path: string;
  handlers: RequestHandler[];
};
