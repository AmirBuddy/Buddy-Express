/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';

export class Response {
  private res: ServerResponse;

  constructor(res: ServerResponse) {
    this.res = res;
  }

  public json(data: object): void {
    this.res.setHeader('Content-Type', 'application/json');
    this.res.end(JSON.stringify(data));
  }

  public redirect(url: string): void {
    this.res.statusCode = 302;
    this.res.setHeader('Location', url);
    this.res.end();
  }

  public status(code: number): this {
    this.res.statusCode = code;
    return this;
  }

  public send(chunk: any): void {
    this.res.end(chunk);
  }

  // Proxy other methods and properties as needed
  public get statusCode(): number {
    return this.res.statusCode;
  }

  public set statusCode(code: number) {
    this.res.statusCode = code;
  }

  public setHeader(name: string, value: string | number | readonly string[]): void {
    this.res.setHeader(name, value);
  }

  // ... proxy other ServerResponse methods and properties as needed
}
