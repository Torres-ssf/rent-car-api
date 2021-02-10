import { AppError } from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateSessionUseCase } from './CreateSessionUseCase';
import { createSessionPipe } from '../../pipes/createSession.pipe';

export class CreateSessionController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = await createSessionPipe(request.body);

      const createSessionUseCase = container.resolve(CreateSessionUseCase);

      const {
        user: { password: removed, ...user },
        token,
      } = await createSessionUseCase.execute({
        email,
        password,
      });

      return response.json({ user, token });
    } catch (err) {
      throw new AppError(
        err.message || 'Error occurred when trying to create new session',
      );
    }
  }
}
