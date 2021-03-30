import { AppError } from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';
import { validateListAvailableCarsDTO } from './validateListAvailableCarsDTO';

export class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listAvailableCarsDTO = await validateListAvailableCarsDTO(
        request.query,
      );

      const listAvailableCarsUseCase = container.resolve(
        ListAvailableCarsUseCase,
      );

      const cars = await listAvailableCarsUseCase.execute(listAvailableCarsDTO);

      return response.json(cars);
    } catch (err) {
      throw new AppError(
        err.message || 'error while trying to list available cars',
      );
    }
  }
}
