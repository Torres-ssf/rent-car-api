import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { dataValidation } from '@shared/utils/dataValidation';
import { RegisterCarUseCase } from './RegisterCarUseCase';
import { RegisterCarDTO } from '../../dtos/RegisterCarDTO';

export class RegisterCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const registerCarDTO = await dataValidation(RegisterCarDTO, request.body);

      const registerCarUseCase = container.resolve(RegisterCarUseCase);

      const newCar = await registerCarUseCase.execute(registerCarDTO);

      return response.json(newCar);
    } catch (err) {
      throw new AppError(
        err.message || 'error occurred while trying to register new car.',
      );
    }
  }
}
