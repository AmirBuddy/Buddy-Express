import { RequestHandler } from './RequestHandler.js';

export type Route = {
  method: string;
  path: string;
  handlers: RequestHandler[];
};
