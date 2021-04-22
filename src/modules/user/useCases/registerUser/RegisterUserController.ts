import { UserMap } from '@modules/user/mapper/UserMap';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { RegisterUserUseCase } from './RegisterUserUseCase';

export class RegisterUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createUserDTO = await dataValidation(CreateUserDTO, request.body);

    const registerUserUseCase = container.resolve(RegisterUserUseCase);

    const newUser = await registerUserUseCase.execute(createUserDTO);

    const userResp = UserMap.toUserResponseDTO(newUser);

    return response.status(201).json(userResp);
  }
}
