/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';

/**
 * Interface for a Response which extends the ServerResponse from Node.js HTTP module.
 * @property {Function} json - Method to send a JSON response.
 * @property {Function} redirect - Method to redirect to a specified URL.
 * @property {Function} status - Method to set the status code of the response.
 * @property {Function} send - Method to send a response.
 */
export interface Response extends ServerResponse {
  json(data: any): void;
  redirect(url: string): void;
  status(code: number): void;
  send(data: any): void;
}
