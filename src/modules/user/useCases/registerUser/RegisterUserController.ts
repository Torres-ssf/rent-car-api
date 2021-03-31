import { AppError } from '@shared/errors/AppError';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RegisterUserDTO } from '../../dtos/RegisterUserDTO';
import { RegisterUserUseCase } from './RegisterUserUseCase';

export class RegisterUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = await dataValidation(
        RegisterUserDTO,
        request.body,
      );

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
