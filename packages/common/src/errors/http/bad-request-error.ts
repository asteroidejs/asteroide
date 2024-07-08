import { HttpError } from './http-error';

export class BadRequestError extends HttpError {
  constructor(message?: string, data?: Record<string, unknown>) {
    super(400, message ?? 'Bad Request', data);
  }
}
