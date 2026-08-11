import pino from 'pino';
import { isProduction } from './config';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' }
      }
});
