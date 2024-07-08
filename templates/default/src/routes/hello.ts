import { Request, Response } from '@asteroidejs/core';

export async function GET(req: Request, res: Response) {
  res.send('Boooom!!!');
}
