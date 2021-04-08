import 'reflect-metadata';

import { Car } from '@modules/car/models/Car';
import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { FakeSpecificationRepository } from '@modules/specification/repositories/fakes/FakeSpecificationRepository';
import { v4 } from 'uuid';
import { AddSpecificationToCarUseCase } from './AddSpecificationToCarUseCase';

describe('AddSpecificationToCar', () => {
  let carRepository: FakeCarRepository;

  let specificationRepository: FakeSpecificationRepository;

  let addSpecificationToCarUseCase: AddSpecificationToCarUseCase;

  beforeAll(() => {
    carRepository = new FakeCarRepository();

    specificationRepository = new FakeSpecificationRepository();

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
});
