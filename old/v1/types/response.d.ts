/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'node:http';

/**
 * Extends the ServerResponse to include additional response methods.
 */
export interface Response extends ServerResponse {
  json: (data: any) => void;
  redirect: (url: string) => void;
}
