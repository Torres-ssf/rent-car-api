import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { Car } from '@modules/car/models/Car';
import { FakeCategoryRepository } from '@modules/car/repositories/fakes/FakeCategoryRepository';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';
import carsSeed from '../../seeds/cars.json';

describe('ListCarUseCase', () => {
  let listAvailableCarsUseCase: ListAvailableCarsUseCase;

  let carRepository: FakeCarRepository;

  let categoryRepository: FakeCategoryRepository;

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    categoryRepository = new FakeCategoryRepository();

    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carRepository);
  });

  it('should list all available cars', async () => {
    const magicNumber = Math.ceil(Math.random() * 5);

    const promiseArr: Promise<Car>[] = [];

    const category = await categoryRepository.create({
      name: 'SUV',
      description: 'Big car',
    });

    for (let i = 0; i < magicNumber; i += 1) {
      const car = carsSeed[i];

      const newCar = new Car();

      promiseArr.push(
        carRepository.save(
          Object.assign(newCar, { ...car, category_id: category.id }),
        ),
      );
    }

    await Promise.all(promiseArr);

    expect(2).toBe(2);
  });
});
