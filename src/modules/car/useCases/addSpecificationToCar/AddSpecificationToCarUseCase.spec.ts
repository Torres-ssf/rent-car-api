import 'reflect-metadata';

import { Car } from '@modules/car/models/Car';
import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { FakeSpecificationRepository } from '@modules/specification/repositories/fakes/FakeSpecificationRepository';
import { v4 } from 'uuid';
import { FakeCategoryRepository } from '@modules/car/repositories/fakes/FakeCategoryRepository';
import { AddSpecificationToCarUseCase } from './AddSpecificationToCarUseCase';

describe('AddSpecificationToCar', () => {
  let carRepository: FakeCarRepository;

  let specificationRepository: FakeSpecificationRepository;

  let categoryRepository: FakeCategoryRepository;

  let addSpecificationToCarUseCase: AddSpecificationToCarUseCase;

  const carParams = {
    model: 'F8',
    brand: 'Ferrari',
    max_speed: 340,
    horse_power: 720,
    zero_to_one_hundred: 2.9,
    daily_value: 800,
    fine_amount: 200,
    license_plate: '1234-MSH',
  };

  beforeAll(() => {
    carRepository = new FakeCarRepository();

    specificationRepository = new FakeSpecificationRepository();

    categoryRepository = new FakeCategoryRepository();

    addSpecificationToCarUseCase = new AddSpecificationToCarUseCase(
      carRepository,
      specificationRepository,
    );
  });

  it('should verify if a car is found for the given car id', async () => {
    await expect(
      addSpecificationToCarUseCase.execute({
        car_id: v4(),
        specifications_ids: [v4()],
      }),
    ).rejects.toHaveProperty('message', 'No car found for the given car id');
  });

  it('should found at least one specification for the given specification ids', async () => {
    const suvCategory = await categoryRepository.create({
      name: 'SUV',
      description: 'Sport Utility Vehicle',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: suvCategory.id,
    });

    await expect(
      addSpecificationToCarUseCase.execute({
        car_id: newCar.id,
        specifications_ids: [v4()],
      }),
    ).rejects.toHaveProperty(
      'message',
      'No specifications were found for the given ids',
    );
  });
});
