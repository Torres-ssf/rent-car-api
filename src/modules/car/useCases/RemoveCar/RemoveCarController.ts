import { AppError } from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RemoveCarUseCase } from './RemoveCarUseCase';

export class RemoveCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      const removeCarUseCase = container.resolve(RemoveCarUseCase);

      await removeCarUseCase.execute(id);

      return response.status(204).send();
    } catch (err) {
      throw new AppError(
        err.message || 'error occurred while trying to delete car registry',
      );
    }
  }
}
