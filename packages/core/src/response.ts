import { HttpCodes } from '@asteroidejs/common';
import { OutgoingHttpHeaders, ServerResponse } from 'http';
import { Response } from './interfaces';

export class AsteroideHttpResponse implements Response {
  private sent = false;

  get alreadySent() {
    return this.sent;
  }

  get headers() {
    return this.response.getHeaders();
  }

  get statusCode() {
    return this.response.statusCode;
  }

  get statusMessage() {
    return this.response.statusMessage;
  }

  constructor(private readonly response: ServerResponse) {}

  end(chunk?: unknown): void {
    this.response.end(chunk);
    this.sent = true;
  }

  getHeader(name: string): string | number | undefined {
    return this.response.getHeader(name) as string | number | undefined;
  }

  hasHeader(name: string): boolean {
    return this.response.hasHeader(name);
  }

  json(body: object): void {
    this.setHeader('Content-Type', 'application/json');
    this.send(JSON.stringify(body));
  }

  removeHeader(name: string): void {
    this.response.removeHeader(name);
  }

  send(body: string | Buffer | Uint8Array): void {
    this.write(body);
    this.end();
  }

  setHeader(name: string, value: string) {
    this.response.setHeader(name, value);
    return this;
  }

  status(code: HttpCodes) {
    this.response.statusCode = code;
    Object.entries(HttpCodes).forEach(([key, value]) => {
      if (value === code) {
        this.response.statusMessage = key;
      }
    });
    return this;
  }

  write(chunk: string | Buffer | Uint8Array) {
    this.response.write(chunk);
    return this;
  }

  writeHead(
    code: HttpCodes,
    headers?: Record<keyof OutgoingHttpHeaders, string>,
  ) {
    this.response.writeHead(code, headers);
    return this;
  }
}
