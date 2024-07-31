/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'node:path';
import { fileURLToPath } from 'url';
import { amirexpress, Request, Response, NextFunction } from './amirexpress/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = amirexpress();

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const jsonParser = (req: Request, res: Response, next: NextFunction): void => {
  console.log('json parser is called');
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
        return next(e);
      }
    }
    next();
  });
};

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  console.log('auth is called');
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

const additionalMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Additional middleware executed');
  next();
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err.message);
  res.status(500);
  res.json({ message: `Error: ${err.message}` });
};

app.use(requestLogger);
app.use(jsonParser);

app.use('/files', app.static(path.join(__dirname, '../', 'public')));

app.use('/user', (req: Request, res: Response, next: NextFunction): void => {
  console.log('a request to /user');
  next();
});

app.get('/', (req: Request, res: Response): void => {
  res.status(200);
  res.send('Hello, world!');
});

app.use(authenticate);

app.get('/user', additionalMiddleware, (req: Request, res: Response): void => {
  const { name } = req.query;
  res.status(200);
  res.json({ name: name });
});

app.get(
  '/test/:id/lol/:newID',
  additionalMiddleware,
  (req: Request, res: Response): void => {
    const { id, newID } = req.params;
    res.status(200);
    res.send(`test number: ${id}, newID: ${newID}`);
  }
);

app.post('/data', (req: Request, res: Response): void => {
  res.status(200);
  res.json(req.body);
});

app.delete('/data', (req: Request, res: Response): void => {
  res.status(200);
  res.send(`Received delete method on /data`);
});

app.get('/redirect', (req: Request, res: Response): void => {
  res.redirect('https://www.example.com');
});

app.all('*', (req: Request, res: Response, next: NextFunction): void => {
  next(new Error('Route not found'));
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
