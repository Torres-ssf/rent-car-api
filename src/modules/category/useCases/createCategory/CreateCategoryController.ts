import { CreateCategoryDTO } from '@modules/category/dtos/CreateCategoryDTO';
import { AppError } from '@shared/errors/AppError';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

export class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const createCategoryDTO = await dataValidation(
        CreateCategoryDTO,
        request.body,
      );
      const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

      const newCategory = await createCategoryUseCase.execute(
        createCategoryDTO,
      );

      return response.json(newCategory);
    } catch (err) {
      throw new AppError(
        err.message || 'error occurred while trying to create new category.',
      );
    }
  }
}
