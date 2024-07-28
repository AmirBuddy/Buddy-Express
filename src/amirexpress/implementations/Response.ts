/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';

export class Response extends ServerResponse {
  public json(data: any) {
    if (!this.hasHeader('Content-Type')) {
      this.setHeader('Content-Type', 'application/json');
    }
    this.end(JSON.stringify(data));
  }

  public redirect(url: string) {
    this.status(302);
    this.setHeader('Location', url);
    this.end(`Redirecting to ${url}`);
  }

  public status(code: number) {
    this.statusCode = code;
  }

  public send(data: any) {
    if (typeof data === 'object' && !Buffer.isBuffer(data)) {
      if (!this.hasHeader('Content-Type')) {
        this.setHeader('Content-Type', 'application/json');
      }
      this.end(JSON.stringify(data));
    } else {
      if (!this.hasHeader('Content-Type')) {
        this.setHeader(
          'Content-Type',
          Buffer.isBuffer(data) ? 'application/octet-stream' : 'text/plain'
        );
      }
      this.end(data);
    }
  }
}
