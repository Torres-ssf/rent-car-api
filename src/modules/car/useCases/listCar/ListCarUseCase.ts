import { Car } from '@modules/car/models/Car';
import { inject, injectable } from 'tsyringe';
import { ICarRepository } from '../../repositories/ICarRepository';

@injectable()
export class ListCarUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  async execute(): Promise<Car[]> {
    return this.carRepository.list();
  }
}
