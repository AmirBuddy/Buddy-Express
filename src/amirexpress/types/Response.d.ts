/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';

export interface Response extends ServerResponse {
  json(data: any): void;
  redirect(url: string): void;
  status(code: number): void;
  send(data: any): void;
}
