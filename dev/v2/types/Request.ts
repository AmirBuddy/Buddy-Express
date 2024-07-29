/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage } from 'node:http';

export interface Request extends IncomingMessage {
  query: Record<string, string | undefined>;
  params: Record<string, string | undefined>;
  body?: any;
}
