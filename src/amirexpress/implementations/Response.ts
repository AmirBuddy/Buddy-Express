/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';
import { Response as IResponse } from '../types/Response.js';

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

export function mountMethods(response: IResponse, res: ServerResponse): void {
  response.status = (code: number) => {
    res.statusCode = code;
  };

  response.json = (data: any) => {
    if (!res.hasHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(data));
  };

  response.redirect = (url: string) => {
    res.statusCode = 302;
    res.setHeader('Location', url);
    res.end(`Redirecting to ${url}`);
  };

  response.send = (data: any) => {
    if (typeof data === 'object' && !Buffer.isBuffer(data)) {
      if (!res.hasHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify(data));
    } else {
      if (!res.hasHeader('Content-Type')) {
        res.setHeader(
          'Content-Type',
          Buffer.isBuffer(data) ? 'application/octet-stream' : 'text/plain'
        );
      }
      res.end(data);
    }
  };
}
