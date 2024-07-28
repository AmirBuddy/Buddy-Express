/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';

/**
 * Extends ServerResponse to add json and redirect methods.
 */
export class EnhancedResponse extends ServerResponse {
  json(data: any) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
  }

  redirect(url: string) {
    this.statusCode = 302;
    this.setHeader('Location', url);
    this.end();
  }
}
