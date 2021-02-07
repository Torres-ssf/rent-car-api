import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { registerUserPipe } from '../../pipes/registerUser.pipe';
import { RegisterUserUseCase } from './RegisterUserUseCase';

export class RegisterUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = await registerUserPipe(request.body);

    const registerUserUseCase = container.resolve(RegisterUserUseCase);

    const user = await registerUserUseCase.execute({ name, email, password });

    return response.json(user);
  }
}
