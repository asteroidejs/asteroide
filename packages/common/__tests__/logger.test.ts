import { Logger } from '../src';

describe('Logger', () => {
  describe('Instance', () => {
    test('should log messages', () => {
      const logger = new Logger();
      const spy = jest.spyOn(logger, 'log');

      logger.log('info', 'Hello, world!');

      expect(spy).toHaveBeenCalledWith('info', 'Hello, world!');
    });

    test('should log info messages', () => {
      const logger = new Logger();
      const spy = jest.spyOn(logger, 'info');

      logger.info('Hello, world!');

      expect(spy).toHaveBeenCalledWith('Hello, world!');
    });

    test('should log errors', () => {
      const logger = new Logger();
      const spy = jest.spyOn(logger, 'error');

      logger.error('Something went wrong!');

      expect(spy).toHaveBeenCalledWith('Something went wrong!');
    });

    test('should log warnings', () => {
      const logger = new Logger();
      const spy = jest.spyOn(logger, 'warn');

      logger.warn('This is a warning!');

      expect(spy).toHaveBeenCalledWith('This is a warning!');
    });

    test('should log debug messages', () => {
      const logger = new Logger();
      const spy = jest.spyOn(logger, 'debug');

      logger.debug('Debugging...');

      expect(spy).toHaveBeenCalledWith('Debugging...');
    });

    test('should return the current timestamp', () => {
      const logger = new Logger();
      const timestamp = logger['getTimestamp']();

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('Static', () => {
    test('should log messages', () => {
      const spy = jest.spyOn(Logger['staticInstanceRef'], 'log');

      Logger.log('info', 'Hello, world!');

      expect(spy).toHaveBeenCalledWith('info', 'Hello, world!');
    });

    test('should log info messages', () => {
      const spy = jest.spyOn(Logger['staticInstanceRef'], 'info');

      Logger.info('Hello, world!');

      expect(spy).toHaveBeenCalledWith('Hello, world!');
    });

    test('should log errors', () => {
      const spy = jest.spyOn(Logger['staticInstanceRef'], 'error');

      Logger.error('Something went wrong!');

      expect(spy).toHaveBeenCalledWith('Something went wrong!');
    });

    test('should log warnings', () => {
      const spy = jest.spyOn(Logger['staticInstanceRef'], 'warn');

      Logger.warn('This is a warning!');

      expect(spy).toHaveBeenCalledWith('This is a warning!');
    });

    test('should log debug messages', () => {
      const spy = jest.spyOn(Logger['staticInstanceRef'], 'debug');

      Logger.debug('Debugging...');

      expect(spy).toHaveBeenCalledWith('Debugging...');
    });
  });
});
