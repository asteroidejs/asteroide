import { isDevMode } from '../../src';

describe('Dev Mode', () => {
  test('should return true when `NODE_ENV` is `development`', () => {
    process.env.NODE_ENV = 'development';
    expect(isDevMode()).toBe(true);
  });
});
