/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from './Response.js';
import { Request } from './Request.js';
import { NextFunction } from './NextFunction.js';

// Define the different handler signatures
export type SimpleHandler = (req: Request, res: Response) => void | Promise<void>;
export type NextHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
export type ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

/**
 * Middelware function type
 */
export type RequestHandler = SimpleHandler | NextHandler | ErrorHandler;
