import { AddSpecificationToCarDTO } from '@modules/car/dtos/AddSpecificationToCarDTO';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AddSpecificationToCarUseCase } from './AddSpecificationToCarUseCase';

export class AddSpecificationToCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const addSpecificationToCarDTO = await dataValidation(
      AddSpecificationToCarDTO,
      {
        ...request.body,
        car_id: id,
      },
    );

    const addSpecificationToCarUseCase = container.resolve(
      AddSpecificationToCarUseCase,
    );

    const carWithSpecs = await addSpecificationToCarUseCase.execute(
      addSpecificationToCarDTO,
    );

    return response.status(201).json(carWithSpecs);
  }
}
