import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { Car } from '../../models/Car';
import { ICarRepository } from '../../repositories/ICarRepository';
import { UpdateCarDTO } from './UpdateCarDTO';

@injectable()
export class UpdateCarUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  async execute(carId: string, updateCarDTO: UpdateCarDTO): Promise<Car> {
    const existentCar = await this.carRepository.findById(carId);

    if (!existentCar) {
      throw new AppError('no car found for the given id');
    }

    const updated_at = new Date();

    Object.assign(existentCar, { ...updateCarDTO, updated_at });

    return this.carRepository.save(existentCar);
  }
}
