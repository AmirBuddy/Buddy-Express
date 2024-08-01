/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from './types';
import { ServerResponse } from 'http';

export function mountResponseMethods(response: Response, res: ServerResponse) {
  response.status = (code: number): Response => {
    res.statusCode = code;
    return res as Response;
  };

  response.json = (data: any): void => {
    if (!res.hasHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(data));
  };

  response.redirect = (url: string): void => {
    res.statusCode = 302;
    res.setHeader('Location', url);
    res.end(`Redirecting to ${url}`);
  };

  response.send = (data: any): void => {
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
