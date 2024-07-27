import { IncomingMessage } from 'node:http';

/**
 * Extends the IncomingMessage to include query and params.
 */
export interface Request extends IncomingMessage {
  query: Record<string, string | undefined>;
  params: Record<string, string | undefined>;
}
