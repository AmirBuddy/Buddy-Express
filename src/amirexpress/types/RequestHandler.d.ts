/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from './Response';
import { Request } from './Request';
import { NextFunction } from './NextFunction';

/**
 * Type for a simple request handler.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {void | Promise<void>}
 */
export type SimpleHandler = (req: Request, res: Response) => void | Promise<void>;

/**
 * Type for a next request handler.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware stack.
 * @returns {void | Promise<void>}
 */
export type NextHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

/**
 * Type for an error request handler.
 * @param {any} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware stack.
 * @returns {void | Promise<void>}
 */
export type ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

/**
 * Type for a request handler which can be a simple, next or error handler.
 */
export type RequestHandler = SimpleHandler | NextHandler | ErrorHandler;
