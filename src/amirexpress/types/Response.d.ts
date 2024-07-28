/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';

export interface Response extends ServerResponse {
  json(data: any): this;
  redirect(url: string): this;
  status(code: number): this;
  send(data: any): this;
}
