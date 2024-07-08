import { Request, Response } from '@asteroidejs/core';
import { GET } from './hello';

describe('Hello route handler', () => {
  describe('GET() handler', () => {
    it('should return greeting', async () => {
      const req = {} as Request;
      const res = {
        json: jest.fn() as Response['send'],
      } as Response;

      await GET(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Hello, World!' });
    });
  });
});
