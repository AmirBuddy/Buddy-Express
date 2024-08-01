# Project Description

## Introduction
**Buddy-Express** is my own unique take on the popular Express framework with my own implementation.

## Requirements
Here are the key features that our framework will provide:

1. **Installation**: You should be able to install our framework using the command `npm install buddyexpress`.

2. **Application Creation**: You should be able to create an `buddyexpress` app using the following code: `const app = buddyexpress()`.

3. **Middlewares**: Our framework allows you to add middlewares using the `app.use((req, res, next) => {})` or `app.use('/<route>', (req, res, next) => {})`.

4. **Routes**: We support the definition of `get`, `post`, `put`, `delete`, `patch` and `all` routes.

5. **TypeScript Support**: `buddyexpress` is strongly typed using TypeScript.

6. **Response Methods**: The framework includes the response methods `res.status()`, `res.send()`, `res.json()`, and `res.redirect()`.

7. **URL Query Parameters**: You can access URL query parameters using `req.query`.

8. **URL Route Parameters**: You can define routes with parameters. Example: define `/test/:id` and access the `:id` from `req.params`.

9. **Static Files**: `buddyexpress` includes a built-in middleware to serve static files using `app.use(app.static('public'))`.

10. **JSON Body Parser**: `buddyexpress` includes a built-in json body parser middleware `app.json()` using like `app.use(app.json())`.

## Usage

```ts
import { buddyexpress, Request, Response, NextFunction } from 'buddyexpress';
import path from 'path';

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.url}`);
  next();
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

const app = buddyexpress();
app.use(requestLogger);
app.use(app.json());

app.use('/files', app.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response): void => {
  res.status(200);
  res.send('Hello, world!');
});

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
```

## Tech Stack
Our framework is built using the following technologies:

- NodeJS
- TypeScript
