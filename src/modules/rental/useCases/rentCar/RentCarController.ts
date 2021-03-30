import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { dataValidation } from '@shared/utils/dataValidation';
import { RentCarUseCase } from './RentCarUseCase';
import { RentCarDTO } from './RentCarDTO';

export class RentCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const rentCarDTO = await dataValidation(RentCarDTO, request.body);

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
