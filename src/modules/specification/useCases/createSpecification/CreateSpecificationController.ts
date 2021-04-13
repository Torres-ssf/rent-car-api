import { CreateSpecificationDTO } from '@modules/specification/dtos/CreateSpecificationDTO';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

export class CreateSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
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

    return response.status(201).json(newSpecification);
  }
}
