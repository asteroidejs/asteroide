import { Asteroide, Request, Response } from '../src';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { AsteroideHttpResponse } from '../src/response';
import { AsteroideHttpRequest } from '../src/request';
import { HttpError } from '@asteroidejs/common';

describe('Asteroide Server', () => {
  let app: Asteroide;
  let httpReq: IncomingMessage;
  let httpRes: ServerResponse;

  beforeEach(async () => {
    app = Asteroide.create();
    httpReq = new IncomingMessage(new Socket());
    httpReq.method = 'GET';
    httpReq.url = '/test';
    httpRes = new ServerResponse(httpReq);

    jest.spyOn(app['router'], 'prepare').mockResolvedValueOnce(void 0);
  });

  describe('Creation', () => {
    test('should create an instance of Asteroide Server with default options', () => {
      expect(app).toBeInstanceOf(Asteroide);
      expect(app.server).toBeDefined();
      expect(app['router']).toBeDefined();
      expect(app.options).toEqual({
        name: 'asteroidejs',
        port: 3000,
        middlewares: [],
      });
    });
  });

  describe('Server', () => {
    test('should start and close the server', async () => {
      const listenSpy = jest.spyOn(app.server, 'listen');
      const closeSpy = jest.spyOn(app.server, 'close');

      await app.start();
      await new Promise<void>((resolve) => app.server.on('listening', resolve));
      expect(listenSpy).toHaveBeenCalledWith(
        3000,
        '0.0.0.0',
        expect.any(Function),
      );
      expect(app.server.listening).toBe(true);

      app.close();

      expect(closeSpy).toHaveBeenCalled();
      expect(app.server.listening).toBe(false);
    });

    describe('Request preparation', () => {
      test('should prepare the request', () => {
        jest.spyOn(app['router'], 'matchRoute').mockReturnValueOnce({
          handler: jest.fn(),
          middlewares: [],
          params: {},
        });

        const { handler, middlewares, request } =
          app['prepareRequest'](httpReq);

        expect(handler).toStrictEqual(expect.any(Function));
        expect(middlewares).toEqual([]);
        expect(request).toBeInstanceOf(AsteroideHttpRequest);
        expect(request.method).toBe('GET');
        expect(request.url.pathname).toBe('/test');
        expect(request.params).toEqual({});
      });

      test('should throw MethodNotAllowedError if method is not provided', () => {
        httpReq.method = '';
        expect(() => app['prepareRequest'](httpReq)).toThrowError(
          'Method Not Allowed',
        );
      });

      test('should prepare the response', () => {
        const preparedResponse = app['prepareResponse'](httpRes);
        expect(preparedResponse).toBeInstanceOf(AsteroideHttpResponse);
      });

      describe('Request handling', () => {
        let req: AsteroideHttpRequest;
        let res: AsteroideHttpResponse;
        const middleware = jest.fn(
          (_: Request, __: Response, next: () => void) => {
            next();
          },
        );

        beforeEach(() => {
          req = new AsteroideHttpRequest(httpReq, {});
          res = new AsteroideHttpResponse(httpRes);
          res.send = jest.fn();
          res.json = jest.fn();
        });

        test('should run middlewares in queue', async () => {
          const middlewares = [middleware];
          const handler = jest.fn().mockResolvedValueOnce(void 0);
          await app['handleRequest'](req, res, middlewares, handler);
          expect(middleware).toHaveBeenCalledWith(
            req,
            res,
            expect.any(Function),
          );
        });

        test('if response is already sent, should not run the handler', async () => {
          const middleware = jest.fn(
            (_: Request, __: Response, next: () => void) => {
              res.end();
              next();
            },
          );
          const handler = jest.fn().mockResolvedValueOnce(void 0);
          await app['handleRequest'](req, res, [middleware], handler);
          expect(handler).not.toHaveBeenCalled();
        });

        test('should run the handler after all middlewares', async () => {
          const middlewares = [middleware];
          const handler = jest.fn().mockResolvedValueOnce(void 0);
          await app['handleRequest'](req, res, middlewares, handler);
          expect(handler).toHaveBeenCalled();
        });

        describe('Handler response', () => {
          test('when handler returns a string/buffer value', async () => {
            const handler = jest.fn().mockResolvedValueOnce('Hello, world!');
            await app['handleRequest'](req, res, [], handler);
            expect(res.send).toHaveBeenCalledWith('Hello, world!');
          });

          test('When handler returns an object', async () => {
            const handler = jest
              .fn()
              .mockResolvedValueOnce({ message: 'Hello' });
            await app['handleRequest'](req, res, [], handler);
            expect(res.json).toHaveBeenCalledWith({ message: 'Hello' });
          });
        });

        describe('Error handling', () => {
          test('When error is an instance of HttpError', async () => {
            const handler = jest
              .fn()
              .mockRejectedValueOnce(new HttpError(400, 'Test'));
            await app['handleRequest'](req, res, [], handler);
            expect(res.statusCode).toBe(400);
            expect(res.statusMessage).toBe('BAD_REQUEST');
            expect(res.send).toHaveBeenCalledWith('Test');
          });

          test('When error is an unknown error', async () => {
            const handler = jest.fn().mockRejectedValueOnce(new Error('Test'));
            const consoleSpy = jest
              .spyOn(console, 'error')
              .mockImplementation();
            await app['handleRequest'](req, res, [], handler);
            expect(res.statusCode).toBe(500);
            expect(res.statusMessage).toBe('INTERNAL_SERVER_ERROR');
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
            expect(consoleSpy).toHaveBeenCalled();
          });
        });
      });

      describe('Server request handling', () => {
        test('should handle the request', async () => {
          const handler = jest.fn(async () => {
            httpRes.emit('finish');
          });
          const middlewares = [
            jest.fn((_: Request, __: Response, next: () => void) => {
              next();
            }),
          ];

          jest.spyOn(app['router'], 'matchRoute').mockReturnValueOnce({
            handler,
            middlewares,
            params: {},
          });

          app.server.emit('request', httpReq, httpRes);

          await new Promise<void>((resolve) => httpRes.on('finish', resolve));

          expect(handler).toHaveBeenCalled();
        });
      });
    });
  });
});
