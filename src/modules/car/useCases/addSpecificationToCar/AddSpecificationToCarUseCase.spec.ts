import 'reflect-metadata';

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

  it('should find specification for all given specifications ids', async () => {
    const suvCategory = await categoryRepository.create({
      name: 'SUV',
      description: 'Sport Utility Vehicle',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: suvCategory.id,
    });

    const newSpecification = await specificationRepository.create({
      name: 'Nitro',
      description: 'Boosts car acceleration when used',
    });

    await expect(
      addSpecificationToCarUseCase.execute({
        car_id: newCar.id,
        specifications_ids: [newSpecification.id, v4()],
      }),
    ).rejects.toHaveProperty(
      'message',
      'One or more specifications were not found for the given ids',
    );
  });

  it('should not add the same specification twice to a car', async () => {
    const suvCategory = await categoryRepository.create({
      name: 'SUV',
      description: 'Sport Utility Vehicle',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: suvCategory.id,
    });

    const newSpecification = await specificationRepository.create({
      name: 'Nitro',
      description: 'Boosts car acceleration when used',
    });

    newCar.specifications.push(newSpecification);

    await carRepository.save(newCar);

    await expect(
      addSpecificationToCarUseCase.execute({
        car_id: newCar.id,
        specifications_ids: [newSpecification.id],
      }),
    ).rejects.toHaveProperty(
      'message',
      `Car already have specification ${newSpecification.name}`,
    );
    expect(newCar.specifications.length).toBe(1);
  });

  it('should add all specifications to a car', async () => {
    const suvCategory = await categoryRepository.create({
      name: 'SUV',
      description: 'Sport Utility Vehicle',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: suvCategory.id,
    });

    const newSpecification1 = await specificationRepository.create({
      name: 'Nitro',
      description: 'Boosts car acceleration when used',
    });

    const newSpecification2 = await specificationRepository.create({
      name: 'Eletric Car',
      description: 'Car which is propelled by one or more electric motors',
    });

    const newSpecification3 = await specificationRepository.create({
      name: '2 Doors',
      description: 'Car with 2 doors',
    });

    await expect(
      addSpecificationToCarUseCase.execute({
        car_id: newCar.id,
        specifications_ids: [
          newSpecification1.id,
          newSpecification2.id,
          newSpecification3.id,
        ],
      }),
    ).resolves.toHaveProperty('specifications');
    expect(newCar.specifications.length).toBe(3);
    expect(newCar.specifications).toContain(newSpecification1);
    expect(newCar.specifications).toContain(newSpecification2);
    expect(newCar.specifications).toContain(newSpecification3);
  });
});
