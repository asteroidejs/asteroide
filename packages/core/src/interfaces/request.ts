import { IncomingHttpHeaders } from 'http';
import { UrlWithParsedQuery } from 'url';
import { HttpMethods } from '@asteroidejs/common';

export interface Request {
  method: keyof typeof HttpMethods;
  url: UrlWithParsedQuery;
  headers: IncomingHttpHeaders;
  params: Record<string, string>;
  query: Record<string, string>;
  store: {
    get<T = unknown>(key: string): T | undefined;
    set<T = unknown>(key: string, value: T): void;
    delete(key: string): void;
  };
  body<T = unknown>(): Promise<Readonly<T>>;
}
