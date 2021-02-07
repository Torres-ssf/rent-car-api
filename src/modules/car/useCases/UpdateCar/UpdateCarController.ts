import { updateShortsterPipe } from '@modules/car/pipes/updateCar.pipe';
import { AppError } from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateCarUseCase } from './UpdateCarUseCase';

export class UpdateCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      const registerCarDTO = await updateShortsterPipe(request.body);

      const registerCarUseCase = container.resolve(UpdateCarUseCase);

      const newCar = await registerCarUseCase.execute(id, registerCarDTO);

      return response.send(newCar);
    } catch (err) {
      throw new AppError(
        err.message || 'error occurred while trying to update car object',
      );
    }
  }
}
