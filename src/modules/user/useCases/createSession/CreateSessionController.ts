import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { dataValidation } from '@shared/utils/dataValidation';
import { CreateSessionUseCase } from './CreateSessionUseCase';
import { CreateSessionDTO } from '../../dtos/CreateSessionDTO';

export class CreateSessionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = await dataValidation(
      CreateSessionDTO,
      request.body,
    );

    const createSessionUseCase = container.resolve(CreateSessionUseCase);

    const {
      user: { password: removed, ...user },
      token,
    } = await createSessionUseCase.execute({
      email,
      password,
    });

    return response.json({ user, token });
  }
}
