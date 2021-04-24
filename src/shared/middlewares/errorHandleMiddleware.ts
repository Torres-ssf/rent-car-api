import { AppError, errorCode } from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';

export const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  if (err instanceof AppError) {
    const { statusCode, message } = err;

    return res.status(statusCode).json({
      message,
      error: errorCode[statusCode] ? errorCode[statusCode] : 'Bad Request',
    });
  }

  return res.status(500).json({
    message: err.message,
    error: 'Internal server error',
  });
};
