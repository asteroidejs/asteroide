import supertest from 'supertest';
import app from '../../src/_app';

describe('/hello', () => {
  afterAll(() => {
    app.close();
  });

  describe('GET', () => {
    it('should return greeting', async () => {
      const res = await supertest(app.server).get('/hello');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Hello, World!' });
    });
  });
});
