/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';
import { Response as ResponseInterface } from '../types/Response.js';
import { Request } from '../types/Request.js';

export class Response extends ServerResponse implements ResponseInterface {
  private statusCodeSet: boolean = false;

  constructor(req: Request) {
    super(req);
  }

  json(data: any): this {
    if (!this.statusCodeSet) {
      this.status(200);
    }
    if (!this.hasHeader('Content-Type')) {
      this.setHeader('Content-Type', 'application/json');
    }
    this.end(JSON.stringify(data));
    return this;
  }

  redirect(url: string): this {
    this.status(302);
    this.setHeader('Location', url);
    this.end(`Redirecting to ${url}`);
    return this;
  }

  status(code: number): this {
    this.statusCode = code;
    this.statusCodeSet = true;
    return this;
  }

  send(data: any): this {
    if (!this.statusCodeSet) {
      this.status(200);
    }
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
    return this;
  }
}
