import { HttpMethods } from '@asteroidejs/common';
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { parse, UrlWithParsedQuery } from 'url';
import { Request } from './interfaces';

export class AlaskaHttpRequest implements Request {
  public readonly headers: IncomingHttpHeaders;
  public readonly method: keyof typeof HttpMethods;
  public readonly params: Record<string, string>;
  public readonly query: Record<string, string>;
  public readonly url: UrlWithParsedQuery;
  public readonly store: {
    get<T = unknown>(key: string): T | undefined;
    set<T = unknown>(key: string, value: T): void;
    delete(key: string): void;
  };

  private readonly memo = new Map<string, unknown>();

  constructor(
    private readonly request: IncomingMessage,
    params: Record<string, string>,
  ) {
    this.headers = request.headers;
    this.method = request.method?.toUpperCase() as keyof typeof HttpMethods;
    this.url = parse(request.url ?? '', true);
    this.query = Object.fromEntries(
      new URLSearchParams(this.url.search ?? '').entries(),
    );
    this.params = params;
    this.store = {
      get: <T>(key: string) => {
        return this.memo.get(key) as T;
      },
      set: (key: string, value: unknown) => {
        this.memo.set(key, value);
      },
      delete: (key: string) => {
        this.memo.delete(key);
      },
    };
  }

  public body<T = unknown>(): Promise<Readonly<T>> {
    return new Promise((resolve) => {
      let data = '';
      this.request.on('data', (chunk) => {
        data += chunk;
      });
      this.request.on('end', () => {
        switch (this.headers['content-type']) {
          case 'application/json':
            resolve(JSON.parse(data));
            break;
          default:
            resolve(data as unknown as T);
            break;
        }
      });
    });
  }
}
