import { createServer } from 'node:http';
import Router from './index.js';

const router = new Router();

router.on('GET', '/lol', (req, res) => {
  res.statusCode = 200;
  res.end('Hello, World!');
});

const server = createServer((req, res) => router.handle(req, res));

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
