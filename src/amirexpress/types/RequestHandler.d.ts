/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from './Response.js';
import { Request } from './Request.js';
import { NextFunction } from './NextFunction.js';

type SimpleHandler = (req: Request, res: Response) => void | Promise<void>;
type NextHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
type ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export type RequestHandler = SimpleHandler | NextHandler | ErrorHandler;
