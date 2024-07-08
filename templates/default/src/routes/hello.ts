import { Request, Response } from '@asteroidejs/core';

export async function GET(_: Request, res: Response) {
  res.json({
    message: 'Hello, World!',
  });
}
