import { Request, Response } from '../interfaces';

export type RouteHandler = (
  request: Request,
  response: Response,
) => Promise<void | unknown>;
