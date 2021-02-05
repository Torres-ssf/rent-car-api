import { inject, injectable } from 'tsyringe';
import { v4 } from 'uuid';
import { Car } from '../../models/Car';
import { ICarRepository } from '../../repositories/ICarRepository';
import { RegisterCarDTO } from './RegisterCarDTO';

@injectable()
export class RegisterCarUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  async execute(registerCarDTO: RegisterCarDTO): Promise<Car> {
    const { name, brand, daily_value } = registerCarDTO;

    const newCar = new Car();

    const date = new Date();

    Object.assign(newCar, {
      id: v4(),
      name,
      brand,
      daily_value,
      created_at: date,
      updated_at: date,
    });

    return newCar;
  }
}
