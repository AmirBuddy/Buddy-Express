/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage } from 'node:http';

export interface Request extends IncomingMessage {
  query: Record<string, string>;
  params: Record<string, string>;
  body?: any;
}
