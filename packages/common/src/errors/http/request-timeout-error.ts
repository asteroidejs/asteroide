import { HttpError } from './http-error';

export class RequestTimeoutError extends HttpError {
  constructor(message?: string) {
    super(408, message ?? 'Request Timeout');
  }
}
