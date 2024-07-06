export class AlaskaServerError extends Error {
  constructor(
    public readonly message: string,
    public readonly name = 'AlaskaServerError',
  ) {
    super(message ?? 'An error occurred while processing the request');
  }

  toString(): string {
    return `${this.message}`;
  }

  toJSON(): Record<string, string | number | undefined> {
    return {
      name: this.name,
      message: this.message,
    };
  }
}
