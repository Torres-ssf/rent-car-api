import { ListAvailableCarsDTO } from '@modules/car/dtos/ListAvailableCarsDTO';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

export class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAvailableCarsDTO = await dataValidation(
      ListAvailableCarsDTO,
      request.query as any,
    );

    const listAvailableCarsUseCase = container.resolve(
      ListAvailableCarsUseCase,
    );

    const cars = await listAvailableCarsUseCase.execute(listAvailableCarsDTO);

    return response.json(cars);
  }
}
