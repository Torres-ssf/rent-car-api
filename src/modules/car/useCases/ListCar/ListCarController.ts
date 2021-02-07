import { AppError } from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListCarUseCase } from './ListCarUseCase';

export class ListCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listCarUseCase = container.resolve(ListCarUseCase);

      const cars = await listCarUseCase.execute();

      return response.json(cars);
    } catch (err) {
      throw new AppError(
        err.message || 'error occurred while trying to fetch cars',
      );
    }
  }
}
