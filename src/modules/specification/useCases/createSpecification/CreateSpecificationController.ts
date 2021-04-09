import { CreateSpecificationDTO } from '@modules/specification/dtos/CreateSpecificationDTO';
import { AppError } from '@shared/errors/AppError';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

export class CreateSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const createSpecificationDTO = await dataValidation(
        CreateSpecificationDTO,
        request.body,
      );

      const createSpecificationUseCase = container.resolve(
        CreateSpecificationUseCase,
      );

      const newSpecification = await createSpecificationUseCase.execute(
        createSpecificationDTO,
      );

      return response.json(newSpecification);
    } catch (err) {
      throw new AppError(
        err.message || 'Error occurred while creating new specification',
      );
    }
  }
}
