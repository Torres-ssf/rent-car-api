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

    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carRepository,
      categoryRepository,
    );
  });

  it('should ensure category exists when category id is provided', async () => {
    await expect(
      listAvailableCarsUseCase.execute({
        category_id: 'not an actual category',
      }),
    ).rejects.toHaveProperty('message', 'Category does not exists');

    const newCategory = await categoryRepository.create({
      name: 'Dummy Category',
      description: 'This is a dummy category',
    });

    await expect(
      listAvailableCarsUseCase.execute({
        category_id: newCategory.id,
      }),
    ).resolves.toBeTruthy();
  });
});
