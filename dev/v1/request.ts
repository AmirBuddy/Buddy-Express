import { IncomingMessage } from 'node:http';

/**
 * Extends IncomingMessage to add query property.
 */
export class EnhancedRequest extends IncomingMessage {
  query: { [key: string]: string | undefined } = {};
}
