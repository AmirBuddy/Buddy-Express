/* eslint-disable @typescript-eslint/no-unused-vars */
import { amirexpress } from './amirexpress/index.js';
import { Request } from './amirexpress/types/Request.js';
import { Response } from './amirexpress/implementations/Response.js';
import { NextFunction } from './amirexpress/types/NextFunction.js';

const app = amirexpress();

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

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

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (!token) {
    return next(new Error('Unauthorized'));
  }
  if (token === 'mysecrettoken') {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
};

const additionalMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('Additional middleware executed');
  next();
};

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
};

app.use(requestLogger);
app.use(jsonParser);

app.use('/user', (req: Request, res: Response, next: NextFunction): void => {
  console.log('a request to /user');
});

app.get('/', (req: Request, res: Response): void => {
  res.status(200).send('Hello, world!');
});

app.use(authenticate);

app.get('/user', additionalMiddleware, (req: Request, res: Response): void => {
  const { name } = req.query;
  res.status(200).json({ name: name });
});

app.get('/test/:id', additionalMiddleware, (req: Request, res: Response): void => {
  const { id } = req.params;
  res.status(200).send(`test number: ${id}`);
});

app.post('/data', (req: Request, res: Response): void => {
  res.status(200).send(`Received data: ${JSON.stringify(req.body)}`);
});

app.delete('/data', (req: Request, res: Response): void => {
  res.status(200).send(`Received delete method on /data}`);
});

app.all('*', (req: Request, res: Response, next: NextFunction): void => {
  next(new Error('Route not found'));
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
