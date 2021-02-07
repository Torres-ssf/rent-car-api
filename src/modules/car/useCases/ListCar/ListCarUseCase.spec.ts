import 'reflect-metadata';

import { Engine, Transmission } from '@modules/car/models/enums';
import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { Car } from '@modules/car/models/Car';
import { ListCarUseCase } from './ListCarUseCase';
import { RegisterCarUseCase } from '../RegisterCar/RegisterCarUseCase';

import carsSeed from '../../seeds/cars.json';

describe('ListCarUseCase', () => {
  let listCarUseCase: ListCarUseCase;

  let registerCarUseCase: RegisterCarUseCase;

  let carRepository: FakeCarRepository;

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    listCarUseCase = new ListCarUseCase(carRepository);

    registerCarUseCase = new RegisterCarUseCase(carRepository);
  });

  it('ensures all cars from the database are listed', async () => {
    const magicNumber = Math.ceil(Math.random() * 5);

    const promiseArr: Promise<Car>[] = [];

    for (let i = 0; i < magicNumber; i += 1) {
      const car = carsSeed[i];

      const engine = car.engine as Engine;
      const transmission = car.transmission as Transmission;

      promiseArr.push(
        registerCarUseCase.execute({ ...car, engine, transmission }),
      );
    }

    await Promise.all(promiseArr);

    const res = await listCarUseCase.execute();

    expect(res).toBeInstanceOf(Array);
    expect(res[0]).toBeInstanceOf(Car);
    expect(res).toHaveLength(magicNumber);
  });
});
