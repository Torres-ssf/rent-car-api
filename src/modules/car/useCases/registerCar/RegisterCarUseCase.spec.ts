import 'reflect-metadata';

import { FakeCategoryRepository } from '@modules/car/repositories/fakes/FakeCategoryRepository';
import { v4 } from 'uuid';
import { FakeCarRepository } from '../../repositories/fakes/FakeCarRepository';
import { RegisterCarUseCase } from './RegisterCarUseCase';

describe('RegisterCarUseCase', () => {
  let carRepository: FakeCarRepository;
  let categoryRepository: FakeCategoryRepository;
  let registerCarUseCase: RegisterCarUseCase;

  const carParams = {
    model: 'F8',
    brand: 'Ferrari',
    max_speed: 340,
    horse_power: 720,
    zero_to_one_hundred: 2.9,
    license_plate: 'MWS-2123',
    daily_value: 900,
    fine_amount: 200,
  };

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    categoryRepository = new FakeCategoryRepository();

    registerCarUseCase = new RegisterCarUseCase(
      categoryRepository,
      carRepository,
    );
  });

  it('should not register a car with an existent license plate', async () => {
    const newCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    await registerCarUseCase.execute({
      ...carParams,
      category_id: newCategory.id,
    });

    await expect(
      registerCarUseCase.execute({
        ...carParams,
        category_id: newCategory.id,
      }),
    ).rejects.toHaveProperty('message', 'License plate already in use');
  });

  it('should not be possible to register a new car that belongs to a nonexistent category', async () => {
    await expect(
      registerCarUseCase.execute({
        ...carParams,
        license_plate: '123123-asda',
        category_id: v4(),
      }),
    ).rejects.toHaveProperty('message', 'Category does not exists');
  });

  it('should be possible to register a new car', async () => {
    const newCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    await expect(
      registerCarUseCase.execute({
        ...carParams,
        license_plate: '123123-asda',
        category_id: newCategory.id,
      }),
    ).resolves.toHaveProperty('license_plate', '123123-asda');
  });
});
