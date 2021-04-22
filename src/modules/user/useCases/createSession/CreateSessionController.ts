import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { dataValidation } from '@shared/utils/dataValidation';
import { UserMap } from '@modules/user/mapper/UserMap';
import { CreateSessionUseCase } from './CreateSessionUseCase';
import { CreateSessionDTO } from '../../dtos/CreateSessionDTO';

export class CreateSessionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = await dataValidation(
      CreateSessionDTO,
      request.body,
    );

    const createSessionUseCase = container.resolve(CreateSessionUseCase);

    const { user, token } = await createSessionUseCase.execute({
      email,
      password,
    });

    const userResp = UserMap.toUserResponseDTO(user);

    return response.status(201).json({ user: userResp, token });
  }
}
