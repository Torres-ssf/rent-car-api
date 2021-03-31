import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICarRepository } from '../../repositories/ICarRepository';

@injectable()
export class RemoveCarUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  async execute(carId: string): Promise<void> {
    const existentCar = await this.carRepository.findById(carId);

    if (!existentCar) {
      throw new AppError('no car found for the given id');
    }

    return this.carRepository.remove(carId);
  }
}
