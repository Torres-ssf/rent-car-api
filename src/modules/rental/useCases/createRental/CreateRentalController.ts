import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { dataValidation } from '@shared/utils/dataValidation';
import { ClientSideCreateRentalDTO } from '@modules/rental/dtos/ClientSideCreateRentalDTO';
import { CreateRentalUseCase } from './CreateRentalUseCase';

export class CreateRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const { car_id } = request.params;

    const { start_date, expected_return_date } = request.body;

    const clientSideCreateRentalDTO = await dataValidation(
      ClientSideCreateRentalDTO,
      {
        user_id: id,
        car_id,
        start_date,
        expected_return_date,
      },
    );

    const createRentalUseCase = container.resolve(CreateRentalUseCase);

    const newRent = await createRentalUseCase.execute(
      clientSideCreateRentalDTO,
    );

    return response.status(201).json(newRent);
  }
}
