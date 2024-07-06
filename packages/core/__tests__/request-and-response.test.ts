import { AlaskaHttpRequest } from '../src/request';
import { AlaskaHttpResponse } from '../src/response';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';

describe('Asteroide Request and Response', () => {
  let req: AlaskaHttpRequest;
  let res: AlaskaHttpResponse;

  beforeEach(() => {
    const _req = new IncomingMessage(new Socket());
    const _res = new ServerResponse(_req);

    _req.method = 'GET';
    _req.url = '/test?query=1';

    req = new AlaskaHttpRequest(_req, {});
    res = new AlaskaHttpResponse(_res);
  });

  describe('Request', () => {
    test('Request should have the correct properties', () => {
      expect(req.method).toBe('GET');
      expect(req.url).toHaveProperty('pathname', '/test');
      expect(req.url).toHaveProperty('query', { query: '1' });
      expect(req.query).toHaveProperty('query', '1');
    });

    test('Response should have the correct properties', () => {
      expect(res.headers).toEqual({});
      expect(res.alreadySent).toBe(false);
    });

    test('Request body should return a promise', async () => {
      const body = req.body();
      expect(body).toBeInstanceOf(Promise);
    });

    test('When resolved, the body should be the correct type', async () => {
      const body = req.body();
      const sendedData = JSON.stringify({ test: 'data' });
      req['request'].emit('data', sendedData);
      req['request'].emit('end');

      const data = await body;
      expect(data).toEqual(sendedData);
    });

    test('When resolved, requests with content-type application/json should return a parsed JSON', async () => {
      const body = req.body();
      req['request'].headers['content-type'] = 'application/json';
      req['request'].emit('data', '{"test": "data"}');
      req['request'].emit('end');

      const data = await body;
      expect(data).toEqual({ test: 'data' });
    });

    describe('Request store', () => {
      test('Store should have the correct properties', () => {
        expect(req.store).toHaveProperty('get');
        expect(req.store).toHaveProperty('set');
        expect(req.store).toHaveProperty('delete');
      });

      test('Store should get and set values correctly', () => {
        req.store.set('test', 'data');
        expect(req.store.get('test')).toBe('data');
      });

      test('Store should delete values correctly', () => {
        req.store.set('test', 'data');
        req.store.delete('test');
        expect(req.store.get('test')).toBeUndefined();
      });
    });
  });

  describe('Response', () => {
    test('Response should set headers correctly', () => {
      res.setHeader('Content-Type', 'application/json');
      expect(res.headers).toEqual({ 'content-type': 'application/json' });
    });

    test('Response should send data correctly', () => {
      res.send(JSON.stringify({ test: 'data' }));
      expect(res.alreadySent).toBe(true);
      expect(res.statusCode).toBe(200);
      expect(res.statusMessage).toBe('OK');
    });

    test('Response should send status code correctly', () => {
      res.status(404);
      expect(res.statusCode).toBe(404);
      expect(res.statusMessage).toBe('NOT_FOUND');
    });

    test('Response should send status code and data correctly', () => {
      res.status(404).send(JSON.stringify({ test: 'data' }));
      expect(res.statusCode).toBe(404);
      expect(res.statusMessage).toBe('NOT_FOUND');
    });

    test('should send a JSON response', () => {
      res.json({ test: 'data' });
      expect(res.headers).toEqual({ 'content-type': 'application/json' });
      expect(res.alreadySent).toBe(true);
      expect(res.statusCode).toBe(200);
      expect(res.statusMessage).toBe('OK');
    });

    test('should write a response', () => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.write(JSON.stringify({ test: 'data' }));
      res.end();
      expect(res.alreadySent).toBe(true);
      expect(res.statusCode).toBe(200);
    });

    test('should set a header', () => {
      res.setHeader('Content-Type', 'application/json');
      expect(res.getHeader('Content-Type')).toBe('application/json');
    });

    test('should remove a header', () => {
      res.setHeader('Content-Type', 'application/json');
      res.removeHeader('Content-Type');
      expect(res.getHeader('Content-Type')).toBeUndefined();
    });

    test('should get a header', () => {
      res.setHeader('Content-Type', 'application/json');
      const header = res.getHeader('Content-Type');
      expect(header).toBe('application/json');
    });

    test('check if header is set', () => {
      res.setHeader('Content-Type', 'application/json');
      const isSet = res.hasHeader('Content-Type');
      expect(isSet).toBe(true);
    });
  });
});
