import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { dataValidation } from '@shared/utils/dataValidation';
import { CreateRentalUseCase } from './CreateRentalUseCase';
import { CreateRentalDTO } from '../../dtos/CreateRentalDTO';

export class RentCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const rentCarDTO = await dataValidation(CreateRentalDTO, request.body);

      const createRentalUseCase = container.resolve(CreateRentalUseCase);

      const newRent = await createRentalUseCase.execute(rentCarDTO);

      return response.json(newRent);
    } catch (err) {
      throw new AppError(
        err.message || 'error occurred while trying to create new rental data.',
      );
    }
  }
}
