import 'reflect-metadata';

import { FakeCategoryRepository } from '@modules/car/repositories/fakes/FakeCategoryRepository';
import { Category } from '@modules/car/models/Category';
import { FakeCarRepository } from '../../repositories/fakes/FakeCarRepository';
import { RegisterCarUseCase } from './RegisterCarUseCase';

describe('RegisterCarUseCase', () => {
  const carRepository = new FakeCarRepository();

  const categoryRepository = new FakeCategoryRepository();

  const registerCarUseCase = new RegisterCarUseCase(carRepository);

  let dummyCategory: Category;

  const carParams = {
    model: 'F8',
    brand: 'Ferrari',
    max_speed: 340,
    horse_power: 720,
    zero_to_one_hundred: 2.9,
    license_plate: 'MWS-2123',
    daily_value: 900,
    fine_amount: 200,
    category_id: 'string',
  };

  beforeAll(async () => {
    dummyCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });
  });

  it('should not register a car with an existent license plate', async () => {
    await registerCarUseCase.execute(carParams);

    await expect(registerCarUseCase.execute(carParams)).rejects.toHaveProperty(
      'message',
      'License plate already in use',
    );
  });
});
