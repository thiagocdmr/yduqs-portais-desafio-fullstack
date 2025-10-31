import { winstonConfig } from './logger.config';
import * as winston from 'winston';

describe('Logger Config', () => {
  it('should export winston config', () => {
    expect(winstonConfig).toBeDefined();
  });

  it('should have transports configured', () => {
    expect(winstonConfig.transports).toBeDefined();
    expect(Array.isArray(winstonConfig.transports)).toBe(true);
    if (Array.isArray(winstonConfig.transports)) {
      expect(winstonConfig.transports.length).toBeGreaterThan(0);
    }
  });

  it('should have console transport', () => {
    if (Array.isArray(winstonConfig.transports)) {
      const consoleTransport = winstonConfig.transports.find(
        (transport) => transport instanceof winston.transports.Console,
      );
      expect(consoleTransport).toBeDefined();
    }
  });

  it('should have file transports for error and combined logs', () => {
    if (Array.isArray(winstonConfig.transports)) {
      const fileTransports = winstonConfig.transports.filter(
        (transport) => transport instanceof winston.transports.File,
      );
      expect(fileTransports.length).toBe(2);
    }
  });

  it('should have 3 transports total (console + 2 files)', () => {
    if (Array.isArray(winstonConfig.transports)) {
      expect(winstonConfig.transports.length).toBe(3);
    }
  });
});
