export type Route = {
  method: string;
  path: string;
  handlers: RequestHandler[];
};
