import { env } from './config';
import { createApp } from './app';
import { logger } from './logger';

const app = createApp();

app.listen(env.PORT, '0.0.0.0', () => {
  logger.info({ port: env.PORT }, 'Sampaio API running');
});
