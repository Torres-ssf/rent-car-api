import { CreateCategoryDTO } from '@modules/category/dtos/CreateCategoryDTO';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

export class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createCategoryDTO = await dataValidation(
      CreateCategoryDTO,
      request.body,
    );
    const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

    const newCategory = await createCategoryUseCase.execute(createCategoryDTO);

    return response.status(201).json(newCategory);
  }
}
