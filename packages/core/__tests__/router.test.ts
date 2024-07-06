import { createRouteFile } from './helpers/create-route-file';
import { Router } from '../src/router';
import { removeAlaskaFolder } from './helpers/remove-alaska-folder';

beforeAll(() => {
  createRouteFile(
    '/user/[id]/[name]/index.ts',
    `
    export async function GET() { return 'Hello from Alaska!' }
  `,
  );

  createRouteFile(
    '/index.ts',
    `
    export async function GET() { return 'Hello from Alaska!' }
  `,
  );
});

afterAll(() => {
  removeAlaskaFolder();
});

describe('Asteroide Route Scanning', () => {
  test('should find all the routes and put them in the routes array', async () => {
    const router = new Router();
    await router.prepare();
    expect(router['routes']).toHaveLength(2);
  });

  test('routes should have some required properties', async () => {
    const router = new Router();
    await router.prepare();
    expect(router['routes']).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          method: 'GET',
          namedRegex: '/',
          params: {},
          pathname: '/',
          regex: '^\\/$',
          middlewares: [],
          handler: expect.any(Function),
        }),
        expect.objectContaining({
          method: 'GET',
          namedRegex: '/user/:id/:name',
          params: { id: 'id', name: 'name' },
          pathname: '/user/:id/:name',
          regex: '^\\/user\\/([^\\/]+)\\/([^\\/]+)$',
          middlewares: [],
          handler: expect.any(Function),
        }),
      ]),
    );
  });

  test('should match a static route', async () => {
    const router = new Router();
    await router.prepare();
    const route = router.matchRoute('GET', '/');
    expect(route).toStrictEqual(
      expect.objectContaining({
        params: {},
        handler: expect.any(Function),
        middlewares: [],
      }),
    );
  });

  test('should match a dynamic route', async () => {
    const router = new Router();
    await router.prepare();
    const route = router.matchRoute('GET', '/user/123/alaska');
    expect(route).toStrictEqual(
      expect.objectContaining({
        params: { id: '123', name: 'alaska' },
        handler: expect.any(Function),
        middlewares: [],
      }),
    );
  });

  test('should throw an error for a non-existing route', async () => {
    const router = new Router();
    await router.prepare();
    expect(() => router.matchRoute('GET', '/non-existing')).toThrow(
      'No matching route found for GET /non-existing',
    );
  });
});
