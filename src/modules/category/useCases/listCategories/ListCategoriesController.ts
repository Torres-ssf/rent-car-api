import { AppError } from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListCategoriesUseCase } from './ListCategoriesUseCase';

export class ListCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);

      const categories = await listCategoriesUseCase.execute();

      return response.json(categories);
    } catch (err) {
      throw new AppError(
        err.message || 'error occurred while trying to fetch categories.',
      );
    }
  }
}
