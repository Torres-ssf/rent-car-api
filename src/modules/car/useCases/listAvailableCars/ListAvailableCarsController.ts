import { AppError } from '@shared/errors/AppError';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

export class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listAvailableCarsUseCase = container.resolve(
        ListAvailableCarsUseCase,
      );

      const cars = await listAvailableCarsUseCase.execute();

      return response.json(cars);
    } catch (err) {
      throw new AppError(
        err.message || 'error while trying to list available cars',
      );
    }
  }
}
