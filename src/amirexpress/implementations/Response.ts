/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';
import { Response as ResponseInterface } from '../types/Response.js';

export class Response extends ServerResponse implements ResponseInterface {
  private statusCodeSet: boolean = false;

  json(data: any): this {
    if (!this.statusCodeSet) {
      this.statusCode = 200;
    }
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
    return this;
  }

  redirect(url: string): this {
    this.statusCode = 302;
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
      this.statusCode = 200;
    }
    if (typeof data === 'object' && !Buffer.isBuffer(data)) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
    } else {
      this.end(data);
    }
    return this;
  }
}
