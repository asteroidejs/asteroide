import { IncomingMessage, ServerResponse } from 'http';
import { Router } from './router';
import { HttpError, Logger, MethodNotAllowedError } from '@asteroidejs/common';
import * as http from 'node:http';
import { RouteHandler, RouteMiddleware } from './types';
import { AsteroideHttpRequest } from './request';
import { AsteroideHttpResponse } from './response';

type AsteroideAppOptions = {
  name: string;
  port: number;
  middlewares: RouteMiddleware[];
};

export class Asteroide {
  private static readonly staticInstanceRef: Asteroide;
  readonly server: http.Server;
  readonly options: AsteroideAppOptions;
  private readonly router: Router;
  private readonly logger: Logger;

  private constructor(options?: Partial<AsteroideAppOptions>) {
    this.router = new Router();
    this.logger = new Logger({
      context: Asteroide.name,
    });

    this.options = {
      name: 'asteroidejs',
      port: 3000,
      middlewares: [],
      ...options,
    };

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

  static create(options?: Partial<AsteroideAppOptions>): Asteroide {
    if (!Asteroide.staticInstanceRef) {
      return new Asteroide(options);
    }

    return Asteroide.staticInstanceRef;
  }

  public start(callback?: () => void): void {
    if (this.server.listening) return;

    this.router
      .prepare()
      .then(() => {
        this.server.listen(this.options.port, '0.0.0.0', () => {
          this.logger.info(
            `${this.options.name} server is running on http://localhost:${this.options.port}`,
          );

          callback?.();
        });
      })
      .catch((error) => {
        this.logger.error(error.toString());
      });
  }

  public close(callback?: () => void): void {
    this.server.close(callback)?.unref();
  }

  private prepareRequest(req: IncomingMessage): Readonly<{
    handler: RouteHandler;
    middlewares: RouteMiddleware[];
    request: AsteroideHttpRequest;
  }> {
    const { method } = req;
    if (!method) throw new MethodNotAllowedError();
    const route = this.router.matchRoute(method || '', req.url || '');
    const preparedRequest = new AsteroideHttpRequest(req, route.params);
    return {
      handler: route.handler,
      middlewares: route.middlewares,
      request: preparedRequest,
    };
  }

  private prepareResponse(res: ServerResponse): AsteroideHttpResponse {
    return new AsteroideHttpResponse(res);
  }

  private async handleRequest(
    req: AsteroideHttpRequest,
    res: AsteroideHttpResponse,
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
    request: AsteroideHttpRequest,
    response: AsteroideHttpResponse,
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
