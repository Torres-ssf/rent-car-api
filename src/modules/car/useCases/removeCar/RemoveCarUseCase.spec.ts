import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { FakeCategoryRepository } from '@modules/car/repositories/fakes/FakeCategoryRepository';
import { RemoveCarUseCase } from './RemoveCarUseCase';
import { RegisterCarUseCase } from '../registerCar/RegisterCarUseCase';

describe('RemoveCarUseCase', () => {
  let removeCarUseCase: RemoveCarUseCase;

  let registerCarUseCase: RegisterCarUseCase;

  let carRepository: FakeCarRepository;

  let categoryRepository: FakeCategoryRepository;

  const carParams = {
    model: 'F8',
    brand: 'Ferrari',
    license_plate: '123-3434',
    max_speed: 340,
    horse_power: 720,
    zero_to_one_hundred: 2.9,
    daily_value: 900,
    fine_amount: 200,
  };

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    removeCarUseCase = new RemoveCarUseCase(carRepository);

    categoryRepository = new FakeCategoryRepository();

    registerCarUseCase = new RegisterCarUseCase(
      categoryRepository,
      carRepository,
    );
  });

  it('ensures car exists in the database to be removed', async () => {
    await expect(
      removeCarUseCase.execute('non existent car id'),
    ).rejects.toHaveProperty('message', 'no car found for the given id');
  });

  it('ensures car is removed from the database', async () => {
    const category = await categoryRepository.create({
      name: 'SUV',
      description: 'Big car',
    });

    const newCar = await registerCarUseCase.execute({
      ...carParams,
      category_id: category.id,
    });

    await expect(removeCarUseCase.execute(newCar.id)).resolves.toBeUndefined();

    const carExists = await carRepository.findById(newCar.id);

    expect(carExists).toBeUndefined();
  });
});
