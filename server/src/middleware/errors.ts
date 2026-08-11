import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { logger } from '../logger';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export const notFoundHandler: ErrorRequestHandler = (_error, _req, res, _next) => {
  res.status(404).json({ error: 'Recurso nao encontrado' });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(422).json({
      error: 'Dados invalidos',
      details: error.flatten()
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details
    });
  }

  logger.error({ error, path: req.path }, 'Unhandled API error');
  return res.status(500).json({ error: 'Não foi possível concluir a solicitação agora.' });
};
