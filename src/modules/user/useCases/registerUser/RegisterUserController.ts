import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { RegisterUserUseCase } from './RegisterUserUseCase';

export class RegisterUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createUserDTO = await dataValidation(CreateUserDTO, request.body);

    const registerUserUseCase = container.resolve(RegisterUserUseCase);

    const {
      password: removed,
      admin: removed1,
      ...newUser
    } = await registerUserUseCase.execute(createUserDTO);

    return response.status(201).json(newUser);
  }
}
