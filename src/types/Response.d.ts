/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';

/**
 * Extends ServerResponse to add json and redirect methods.
 */
export class Response extends ServerResponse {
  public json(data: any): void {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
  }

  public redirect(url: string): void {
    this.statusCode = 302;
    this.setHeader('Location', url);
    this.end();
  }
}
