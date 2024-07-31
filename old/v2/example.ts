/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { amirexpress } from './index.js';
import { NextFunction } from './types/NextFunction.js';
import { Request } from './types/Request.js';
import { Response } from './types/Response.js';

// Create an instance of AmirExpress
const app = amirexpress();

// Middleware to log requests
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Middleware to parse JSON bodies
const jsonParser = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'];
  if (!(contentType && contentType.includes('application/json'))) {
    return next();
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    if (body) {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        return next(new Error('Invalid JSON'));
      }
    }
    next();
  });
};

// Error handler
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).send(`Error: ${(err as Error).message}`);
};

// Define some routes with multiple middlewares
app.use(requestLogger);
app.use(jsonParser);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello, world!');
});

app.get('/test/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).send(`test number: ${id}`);
});

app.get('/user', (req: Request, res: Response) => {
  const { name } = req.query;
  res.status(200).json({ name: name });
});

app.post('/data', jsonParser, (req: Request, res: Response) => {
  res.status(200).send(`Received data: ${JSON.stringify(req.body)}`);
});

app.use(errorHandler);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
