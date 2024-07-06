import { HttpError } from './http-error';

export class ConflictError extends HttpError {
  constructor(message?: string) {
    super(409, message ?? 'Conflict');
  }
}
