/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';
import { Response } from '../types/Response.js';

export function mountMethods(response: Response, res: ServerResponse): void {
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
