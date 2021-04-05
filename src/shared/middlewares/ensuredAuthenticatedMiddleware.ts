import { AppError } from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import auth from '@config/auth';

interface ITokenPayLoad {
  iat: number;
  exp: number;
  sub: string;
}

export const ensuredAuthenticatedMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  const { secret } = auth.jwt;

  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as ITokenPayLoad;

    request.user = {
      id: sub,
    };

    next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
};
