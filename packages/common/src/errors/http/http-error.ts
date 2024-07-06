import { AlaskaServerError } from '../alaska-server-error';

export class HttpError extends AlaskaServerError {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super(message, 'HttpError');
  }

  toString(): string {
    return `${this.statusCode} ${this.message}`;
  }

  toJSON(): Record<string, string | number | undefined> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
