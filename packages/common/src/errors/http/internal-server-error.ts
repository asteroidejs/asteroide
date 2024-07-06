import { HttpError } from './http-error';

export class InternalServerError extends HttpError {
  constructor(message?: string) {
    super(500, message ?? 'Internal Server Error');
  }
}
