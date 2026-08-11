import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config';
import { errorHandler } from './middleware/errors';
import { logger } from './logger';
import { healthRouter } from './routes/health';
import { mapsRouter } from './routes/maps';
import { rideRequestsRouter } from './routes/rideRequests';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || origin === env.FRONTEND_URL) {
          callback(null, true);
          return;
        }
        callback(new Error('Origem nao permitida por CORS'));
      },
      methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token']
    })
  );
  app.use(express.json({ limit: '32kb' }));
  app.use(pinoHttp({ logger }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 80,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(
    '/api/ride-requests',
    rateLimit({
      windowMs: 10 * 60 * 1000,
      limit: 20,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use('/api/health', healthRouter);
  app.use('/api/maps', mapsRouter);
  app.use('/api/ride-requests', rideRequestsRouter);
  app.use(errorHandler);

  return app;
}
