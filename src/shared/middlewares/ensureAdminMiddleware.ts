import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { IUserRepository } from '@modules/user/repositories/IUserRepository';
import { AppError } from '@shared/errors/AppError';

export const ensureAdminMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = request.user;

  const userRepository = container.resolve<IUserRepository>('UserRepository');

  const user = await userRepository.findById(id);

  if (!user || !user.admin) {
    throw new AppError('An admin is required for this operation', 401);
  }

  next();
};
