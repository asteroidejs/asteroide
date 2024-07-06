import { Asteroide } from '../src';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { AlaskaHttpResponse } from '../src/response';
import { AlaskaHttpRequest } from '../src/request';
import { HttpError, Request, Response } from '@asteroidejs/common';

describe('Asteroide Server', () => {
  let alaska: Asteroide;
  let httpReq: IncomingMessage;
  let httpRes: ServerResponse;

  beforeEach(async () => {
    alaska = await Asteroide.create();
    httpReq = new IncomingMessage(new Socket());
    httpReq.method = 'GET';
    httpReq.url = '/test';
    httpRes = new ServerResponse(httpReq);

    jest.spyOn(alaska['router'], 'prepare').mockResolvedValueOnce(void 0);
  });

  describe('Creation', () => {
    test('should create an instance of Asteroide Server with default options', () => {
      expect(alaska).toBeInstanceOf(Asteroide);
      expect(alaska.server).toBeDefined();
      expect(alaska['router']).toBeDefined();
      expect(alaska.options).toEqual({
        name: 'alaska-server',
        port: 3000,
        middlewares: [],
      });
    });
  });

  describe('Server', () => {
    test('should start and close the server', async () => {
      const listenSpy = jest.spyOn(alaska.server, 'listen');
      const closeSpy = jest.spyOn(alaska.server, 'close');

      await alaska.start();
      await new Promise<void>((resolve) =>
        alaska.server.on('listening', resolve),
      );
      expect(listenSpy).toHaveBeenCalledWith(3000, '0.0.0.0', undefined);
      expect(alaska.server.listening).toBe(true);

      alaska.close();

      expect(closeSpy).toHaveBeenCalled();
      expect(alaska.server.listening).toBe(false);
    });

    describe('Request preparation', () => {
      test('should prepare the request', () => {
        jest.spyOn(alaska['router'], 'matchRoute').mockReturnValueOnce({
          handler: jest.fn(),
          middlewares: [],
          params: {},
        });

        const { handler, middlewares, request } =
          alaska['prepareRequest'](httpReq);

        expect(handler).toStrictEqual(expect.any(Function));
        expect(middlewares).toEqual([]);
        expect(request).toBeInstanceOf(AlaskaHttpRequest);
        expect(request.method).toBe('GET');
        expect(request.url.pathname).toBe('/test');
        expect(request.params).toEqual({});
      });

      test('should throw MethodNotAllowedError if method is not provided', () => {
        httpReq.method = '';
        expect(() => alaska['prepareRequest'](httpReq)).toThrowError(
          'Method Not Allowed',
        );
      });

      test('should prepare the response', () => {
        const preparedResponse = alaska['prepareResponse'](httpRes);
        expect(preparedResponse).toBeInstanceOf(AlaskaHttpResponse);
      });

      describe('Request handling', () => {
        let req: AlaskaHttpRequest;
        let res: AlaskaHttpResponse;
        const middleware = jest.fn(
          (_: Request, __: Response, next: () => void) => {
            next();
          },
        );

        beforeEach(() => {
          req = new AlaskaHttpRequest(httpReq, {});
          res = new AlaskaHttpResponse(httpRes);
          res.send = jest.fn();
          res.json = jest.fn();
        });

        test('should run middlewares in queue', async () => {
          const middlewares = [middleware];
          const handler = jest.fn().mockResolvedValueOnce(void 0);
          await alaska['handleRequest'](req, res, middlewares, handler);
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
          await alaska['handleRequest'](req, res, [middleware], handler);
          expect(handler).not.toHaveBeenCalled();
        });

        test('should run the handler after all middlewares', async () => {
          const middlewares = [middleware];
          const handler = jest.fn().mockResolvedValueOnce(void 0);
          await alaska['handleRequest'](req, res, middlewares, handler);
          expect(handler).toHaveBeenCalled();
        });

        describe('Handler response', () => {
          test('when handler returns a string/buffer value', async () => {
            const handler = jest.fn().mockResolvedValueOnce('Hello, world!');
            await alaska['handleRequest'](req, res, [], handler);
            expect(res.send).toHaveBeenCalledWith('Hello, world!');
          });

          test('When handler returns an object', async () => {
            const handler = jest
              .fn()
              .mockResolvedValueOnce({ message: 'Hello' });
            await alaska['handleRequest'](req, res, [], handler);
            expect(res.json).toHaveBeenCalledWith({ message: 'Hello' });
          });
        });

        describe('Error handling', () => {
          test('When error is an instance of HttpError', async () => {
            const handler = jest
              .fn()
              .mockRejectedValueOnce(new HttpError(400, 'Test'));
            await alaska['handleRequest'](req, res, [], handler);
            expect(res.statusCode).toBe(400);
            expect(res.statusMessage).toBe('BAD_REQUEST');
            expect(res.send).toHaveBeenCalledWith('Test');
          });

          test('When error is an unknown error', async () => {
            const handler = jest.fn().mockRejectedValueOnce(new Error('Test'));
            const consoleSpy = jest
              .spyOn(console, 'error')
              .mockImplementation();
            await alaska['handleRequest'](req, res, [], handler);
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

          jest.spyOn(alaska['router'], 'matchRoute').mockReturnValueOnce({
            handler,
            middlewares,
            params: {},
          });

          alaska.server.emit('request', httpReq, httpRes);

          await new Promise<void>((resolve) => httpRes.on('finish', resolve));

          expect(handler).toHaveBeenCalled();
        });
      });
    });
  });
});
