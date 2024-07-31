/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage } from 'node:http';

/**
 * Interface for a Request which extends the IncomingMessage from Node.js HTTP module.
 * @property {Record<string, string>} query - An object containing the URL query parameters.
 * @property {Record<string, string>} params - An object containing the route parameters.
 * @property {any} [body] - The body of the request (optional).
 */
export interface Request extends IncomingMessage {
  query: Record<string, string>;
  params: Record<string, string>;
  body?: any;
}
