import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { RentCarUseCase } from './RentCarUseCase';
import { rentCarPipe } from '../pipes/rentCar.pipe';

export class RentCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const rentCarDTO = await rentCarPipe(request.body);

      const rentCarUseCase = container.resolve(RentCarUseCase);

      const newRent = await rentCarUseCase.execute(rentCarDTO);

      return response.json(newRent);
    } catch (err) {
      throw new AppError(
        err.message || 'error occurred while trying to create new rental data.',
      );
    }
  }
}
