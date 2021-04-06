import { inject, injectable } from 'tsyringe';
import { Car } from '@modules/car/models/Car';
import { ICarRepository } from '@modules/car/repositories/ICarRepository';

@injectable()
export class ListAvailableCarsUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  async execute(): Promise<Car[]> {
    return this.carRepository.listAvailableCars();
  }
}
