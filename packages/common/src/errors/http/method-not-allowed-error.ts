import { HttpError } from './http-error';

export class MethodNotAllowedError extends HttpError {
  constructor(message?: string) {
    super(405, message ?? 'Method Not Allowed');
  }
}
