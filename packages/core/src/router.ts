import {
  DirectoryScanner,
  HttpMethods,
  NotFoundError,
  RouteHandler,
  RouteMiddleware,
} from '@asteroidejs/common';
import { ROUTES_FOLDER } from '@asteroidejs/config';
import path from 'path';

type RouteModule = {
  [K in HttpMethods]: RouteHandler;
} & {
  middlewares?: RouteMiddleware[];
};

type Route = {
  pathname: string;
  regex: string;
  method: keyof typeof HttpMethods;
  params: Record<string, string>;
  namedRegex: string;
  middlewares: RouteMiddleware[];
  handler: RouteHandler;
};

export class Router {
  private routes: Route[] = [];

  async prepare(): Promise<void> {
    const routeFiles: string[] = [];

    await new DirectoryScanner({
      rootDir: ROUTES_FOLDER,
      searchFor: [/\/*.(ts|js)$/],
      onFile(filePath: string): void {
        delete require.cache[filePath];
        routeFiles.push(filePath);
      },
    }).scan();

    await this.loadRoutes(routeFiles);
  }

  matchRoute(
    method: string,
    pathname: string,
  ): Readonly<{
    handler: RouteHandler;
    middlewares: RouteMiddleware[];
    params: Readonly<Record<string, string>>;
  }> {
    const matchingRoute = this.routes.find(
      (route) =>
        route.method === method && new RegExp(route.regex).test(pathname),
    );

    if (!matchingRoute)
      throw new NotFoundError(
        `No matching route found for ${method} ${pathname}`,
      );

    const params =
      pathname.match(new RegExp(matchingRoute.regex))?.slice(1) || [];

    return {
      handler: matchingRoute.handler,
      middlewares: matchingRoute.middlewares,
      params: Object.fromEntries(
        Object.entries(matchingRoute.params).map(([key], index) => [
          key,
          params[index],
        ]),
      ),
    };
  }

  private async loadRoutes(routeFiles: string[]): Promise<void> {
    const promises = routeFiles.map(async (filePath) => {
      const routeModule = await this.importRouteModule(path.resolve(filePath));
      this.extractHandlerNames(routeModule).forEach((handler) => {
        this.routes.push({
          ...this.extractRouteInfo(filePath, handler),
          middlewares: routeModule.middlewares || [],
          handler: routeModule[handler],
        });
      });
    });

    await Promise.all(promises);
  }

  private extractHandlerNames(routeModule: RouteModule): HttpMethods[] {
    return Object.keys(routeModule).filter((key) =>
      Object.values(HttpMethods).includes(key as HttpMethods),
    ) as HttpMethods[];
  }

  private extractRouteInfo(
    routeFilePath: string,
    method: HttpMethods,
  ): Omit<Route, 'middlewares' | 'handler'> {
    const relativePath = routeFilePath.split(
      new RegExp(`${ROUTES_FOLDER}/`),
    )[1];
    const pathname = `/${relativePath
      .replace(/\.ts$/, '')
      .replace(/\.js$/, '')
      .replace(/index$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1')
      .replaceAll(/\\/g, '/')
      .replace(/\/$/, '')}`;
    const params: Record<string, string> = {};
    const namedRegex = pathname.replace(/:(\w+)/g, (_, key) => {
      params[key] = key;
      return `:${key}`;
    });
    const regex = new RegExp(
      `^${namedRegex.replace(/\//g, '\\/').replace(/:\w+/g, '([^\\/]+)')}$`,
    );

    return {
      method,
      namedRegex,
      params,
      pathname,
      regex: regex.source,
    };
  }

  private async importRouteModule(filePath: string): Promise<RouteModule> {
    return await import(filePath);
  }
}
