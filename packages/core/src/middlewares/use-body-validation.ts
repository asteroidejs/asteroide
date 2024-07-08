import { BadRequestError } from '@asteroidejs/common';
import { ZodError, ZodSchema } from 'zod';
import { RouteHandler } from '../types';
import { Request, Response } from '../interfaces';

function parseErrors(error: ZodError) {
  const { errors } = error;
  const obj: Record<string, string> = {};

  for (const err of errors) {
    const key = err.path.join('.');
    obj[key] = err.message;
  }

  return obj;
}

export async function useBodyValidation(
  /**
   * The schema to validate the body against.
   */
  schema: ZodSchema,
  /**
   * The message to send if the body is invalid.
   */
  message: string,
  /**
   * The handler to call if the body is valid.
   */
  handler: (
    req: Request & {
      body(): Promise<ReturnType<(typeof schema)['_output']['parse']>>;
    },
    res: Response,
  ) => Promise<unknown>,
): Promise<RouteHandler> {
  return async (request, response) => {
    const body = await request.body();

    if (!body) throw new BadRequestError('Request body is required');

    const validated = schema.safeParse(body);
    if (!validated.success)
      throw new BadRequestError(
        message ?? 'Failed to validate request body',
        parseErrors(validated.error),
      );

    request.body = () => new Promise((resolve) => resolve(validated.data));
    return handler(request, response);
  };
}
