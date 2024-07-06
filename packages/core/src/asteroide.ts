import { IncomingMessage, ServerResponse } from 'http';
import { Router } from './router';
import {
  HttpError,
  MethodNotAllowedError,
  RouteHandler,
  RouteMiddleware,
} from '@asteroidejs/common';
import { AlaskaHttpRequest } from './request';
import { AlaskaHttpResponse } from './response';
import * as http from 'node:http';

type AlaskaServerOptions = {
  name: string;
  port: number;
  middlewares: RouteMiddleware[];
};

export class Asteroide {
  private readonly router = new Router();
  readonly server: http.Server;
  readonly options: AlaskaServerOptions = {
    name: 'alaska-server',
    port: 3000,
    middlewares: [],
  };

  private constructor(options?: Partial<AlaskaServerOptions>) {
    Object.assign(this.options, options);

    this.server = http.createServer(async (req, res) => {
      const { handler, middlewares, request } = this.prepareRequest(req);
      const response = this.prepareResponse(res);
      await this.handleRequest(
        request,
        response,
        this.options.middlewares.concat(middlewares),
        handler,
      );
    });
  }

  public async start(callback?: () => void): Promise<void> {
    await this.router.prepare().then(() => {
      this.server.listen(this.options.port, '0.0.0.0', callback);
    });
  }

  public close(callback?: () => void): void {
    this.server.close(callback);
  }

  public static async create(
    options?: Partial<AlaskaServerOptions>,
  ): Promise<Asteroide> {
    return new Asteroide(options);
  }

  private prepareRequest(req: IncomingMessage): Readonly<{
    handler: RouteHandler;
    middlewares: RouteMiddleware[];
    request: AlaskaHttpRequest;
  }> {
    const { method } = req;
    if (!method) throw new MethodNotAllowedError();
    const route = this.router.matchRoute(method || '', req.url || '');
    const preparedRequest = new AlaskaHttpRequest(req, route.params);
    return {
      handler: route.handler,
      middlewares: route.middlewares,
      request: preparedRequest,
    };
  }

  private prepareResponse(res: ServerResponse): AlaskaHttpResponse {
    return new AlaskaHttpResponse(res);
  }

  private async handleRequest(
    req: AlaskaHttpRequest,
    res: AlaskaHttpResponse,
    middlewares: RouteMiddleware[],
    handler: RouteHandler,
  ): Promise<void> {
    await new Promise<void>((resolve) => {
      let i = 0;
      const next = async () => {
        if (res.alreadySent) {
          return resolve();
        }

        if (i >= middlewares.length) {
          return resolve();
        }

        await middlewares[i++](req, res, next);
      };

      next();
    });

    !res.alreadySent && (await this.runRouteHandler(req, res, handler));
  }

  private async runRouteHandler(
    request: AlaskaHttpRequest,
    response: AlaskaHttpResponse,
    handler: RouteHandler,
  ) {
    try {
      const result = await handler(request, response);

      if (!response.alreadySent) {
        if (!result) {
          return response.status(204).end();
        }

        typeof result === 'string' || Buffer.isBuffer(result)
          ? response.send(result)
          : response.json(result);
      }
    } catch (error) {
      if (error.name === HttpError.name) {
        response.status(error.statusCode).send(error.message);
        return;
      }

      console.error(error);
      response.status(500).send('Internal Server Error');
    }
  }
}
