import express, { Request } from 'express';

const app = express();

let count = 0;
interface ireq extends Request {
  count?: number;
}

app.use((req: ireq, res, next) => {
  req.count = count++;
  next();
});

app.get('/', (req: ireq, res) => {
  res.send(`get req number ${req.count}`);
});

app.post('/', (req: ireq, res) => {
  res.send(`post req number ${req.count}`);
});

app.listen(4000, () => {
  console.log('express listening on port 4000');
});
