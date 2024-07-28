/* eslint-disable @typescript-eslint/no-unused-vars */
import { amirexpress, Request, Response } from './amirexpress/index.js';

const app = amirexpress();

app.get('/', (req: Request, res: Response): void => {
  res.status(200).send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
