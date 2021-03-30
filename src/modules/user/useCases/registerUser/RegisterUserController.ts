import { AppError } from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { registerUserPipe } from '../../pipes/registerUser.pipe';
import { RegisterUserUseCase } from './RegisterUserUseCase';

export class RegisterUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = await registerUserPipe(request.body);

      const registerUserUseCase = container.resolve(RegisterUserUseCase);

      const { password: removed, ...user } = await registerUserUseCase.execute({
        name,
        email,
        password,
      });

      return response.json(user);
    } catch (err) {
      throw new AppError(
        err.message || 'error occurred while trying to register new user',
      );
    }
  }
}
