import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { Car } from '@modules/car/models/Car';
import { FakeCategoryRepository } from '@modules/category/repositories/fakes/FakeCategoryRepository';
import { ListCarUseCase } from './ListCarUseCase';

import carsSeed from '../../seeds/cars.json';

describe('ListCarUseCase', () => {
  let listCarUseCase: ListCarUseCase;

  let categoryRepository: FakeCategoryRepository;

  let carRepository: FakeCarRepository;

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    categoryRepository = new FakeCategoryRepository();

    listCarUseCase = new ListCarUseCase(carRepository);
  });

  it('ensures all cars from the database are listed', async () => {
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

    const res = await listCarUseCase.execute();

    expect(res).toBeInstanceOf(Array);
    expect(res[0]).toBeInstanceOf(Car);
    expect(res).toHaveLength(magicNumber);
  });
});
