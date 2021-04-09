import { AddSpecificationToCarDTO } from '@modules/car/dtos/AddSpecificationToCarDTO';
import { AppError } from '@shared/errors/AppError';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AddSpecificationToCarUseCase } from './AddSpecificationToCarUseCase';

export class AddSpecificationToCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    try {
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

      const car = await addSpecificationToCarUseCase.execute(
        addSpecificationToCarDTO,
      );

      return response.json(car);
    } catch (err) {
      throw new AppError(
        err.message ||
          'Error occuured while trying to add specification to car',
      );
    }
  }
}
