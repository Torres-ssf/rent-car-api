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
    const {
      model,
      brand,
      engine,
      horse_power,
      max_speed,
      transmission,
      zero_to_one_hundred,
      passengers,
      daily_value,
    } = registerCarDTO;

    const newCar = new Car();

    const date = new Date();

    Object.assign(newCar, {
      id: v4(),
      model,
      brand,
      daily_value,
      engine,
      horse_power,
      max_speed,
      transmission,
      zero_to_one_hundred,
      passengers,
      created_at: date,
      updated_at: date,
    });

    return newCar;
  }
}
