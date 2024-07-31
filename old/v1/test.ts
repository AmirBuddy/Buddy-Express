/* eslint-disable @typescript-eslint/no-explicit-any */
// Importing necessary types from the 'http' module
import { IncomingMessage, ServerResponse } from 'http';
import express from 'express';

// Define the basic types for Request and Response
type Request = IncomingMessage;
type Response = ServerResponse;
type NextFunction = (err?: any) => void;

// Define the different handler signatures
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

// Union type of all handler signatures
type RequestHandler = SimpleHandler | NextHandler | ErrorHandler;

// Example usage:
const handler1: RequestHandler = (req, res) => {
  res.end('Hello World');
};

const handler2: RequestHandler = async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  res.end('Hello Async World');
};

const handler3: RequestHandler = (req, res, next) => {
  next();
};

const handler4: RequestHandler = (err, req, res, next) => {
  console.error(err);
  res.statusCode = 500;
  res.end('Internal Server Error');
};

// Function to add handlers to your router (example)
function addHandler(handler: RequestHandler) {
  // Logic to add the handler to your router
}

const app = express();

app.use();
