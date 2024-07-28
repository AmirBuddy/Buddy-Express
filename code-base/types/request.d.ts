import { IncomingMessage } from 'node:http';

/**
 * Extends the IncomingMessage to include query parameters.
 */
export interface Request extends IncomingMessage {
  query: { [key: string]: string | undefined };
}
