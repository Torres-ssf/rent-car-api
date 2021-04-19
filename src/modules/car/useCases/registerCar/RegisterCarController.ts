import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { dataValidation } from '@shared/utils/dataValidation';
import { RegisterCarUseCase } from './RegisterCarUseCase';
import { RegisterCarDTO } from '../../dtos/RegisterCarDTO';

export class RegisterCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const registerCarDTO = await dataValidation(RegisterCarDTO, request.body);

    const registerCarUseCase = container.resolve(RegisterCarUseCase);

    const newCar = await registerCarUseCase.execute(registerCarDTO);

    return response.status(201).json(newCar);
  }
}
