import { RequestHandler } from './RequestHandler.js';

export interface IRoute {
  method: string;
  url: string;
  handlers: RequestHandler[];
}
