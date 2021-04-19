import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { FakeCategoryRepository } from '@modules/category/repositories/fakes/FakeCategoryRepository';
import categoriesSeeds from '@modules/category/seeds/categories.json';
import carsSeeds from '../../seeds/cars.json';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

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
      name: categoriesSeeds[0].name,
      description: categoriesSeeds[0].description,
    });

    await expect(
      listAvailableCarsUseCase.execute({
        category_id: newCategory.id,
      }),
    ).resolves.toBeTruthy();
  });

  it('should return only available cars', async () => {
    const newCategory = await categoryRepository.create({
      name: categoriesSeeds[0].name,
      description: categoriesSeeds[0].description,
    });

    const car1 = await carRepository.create({
      ...carsSeeds[0],
      category_id: newCategory.id,
    });

    const car2 = await carRepository.create({
      ...carsSeeds[1],
      category_id: newCategory.id,
    });

    const car3 = await carRepository.create({
      ...carsSeeds[2],
      category_id: newCategory.id,
    });

    await carRepository.save({ ...car1, available: false });

    const availableCars = await listAvailableCarsUseCase.execute({});

    expect(availableCars).toContain(car2);
    expect(availableCars).toContain(car3);
    expect(availableCars).not.toContain(car1);
  });

  it('should return available cars from the provided category when category is provided', async () => {
    const suvCategory = await categoryRepository.create({
      name: categoriesSeeds[0].name,
      description: categoriesSeeds[0].description,
    });

    const sedanCategory = await categoryRepository.create({
      name: categoriesSeeds[1].name,
      description: categoriesSeeds[1].description,
    });

    const car1 = await carRepository.create({
      ...carsSeeds[0],
      category_id: suvCategory.id,
    });

    const car2 = await carRepository.create({
      ...carsSeeds[1],
      category_id: suvCategory.id,
    });

    const car3 = await carRepository.create({
      ...carsSeeds[2],
      category_id: sedanCategory.id,
    });

    await carRepository.save({ ...car1, available: false });

    const availableCars = await listAvailableCarsUseCase.execute({
      category_id: suvCategory.id,
    });

    expect(availableCars).toContain(car2);
    expect(availableCars).not.toMatchObject(car1);
    expect(availableCars).not.toMatchObject(car3);
  });

  it('should return available cars from the provided model when model is provided', async () => {
    const sedanCategory = await categoryRepository.create({
      name: categoriesSeeds[0].name,
      description: categoriesSeeds[0].description,
    });

    const car1 = await carRepository.create({
      ...carsSeeds[0],
      model: 'Enzo',
      category_id: sedanCategory.id,
    });

    const car2 = await carRepository.create({
      ...carsSeeds[1],
      model: 'F8',
      category_id: sedanCategory.id,
    });

    const car3 = await carRepository.create({
      ...carsSeeds[2],
      model: 'SF90',
      category_id: sedanCategory.id,
    });

    await carRepository.save({ ...car2, available: false });

    const availableCars = await listAvailableCarsUseCase.execute({
      model: 'f',
    });

    expect(availableCars).toContain(car3);
    expect(availableCars).not.toContain(car1);
    expect(availableCars).not.toContain(car2);
  });

  it('should return available cars from the provided brand when brand is provided', async () => {
    const sedanCategory = await categoryRepository.create({
      name: categoriesSeeds[0].name,
      description: categoriesSeeds[0].description,
    });

    const car1 = await carRepository.create({
      ...carsSeeds[0],
      brand: 'Ferrari',
      category_id: sedanCategory.id,
    });

    const car2 = await carRepository.create({
      ...carsSeeds[1],
      brand: 'Ferrari',
      category_id: sedanCategory.id,
    });

    const car3 = await carRepository.create({
      ...carsSeeds[2],
      brand: 'Ferrari',
      category_id: sedanCategory.id,
    });

    const car4 = await carRepository.create({
      ...carsSeeds[3],
      brand: 'Audi',
      category_id: sedanCategory.id,
    });

    await carRepository.save({ ...car2, available: false });

    const availableCars = await listAvailableCarsUseCase.execute({
      brand: 'ferra',
    });

    expect(availableCars).toContain(car1);
    expect(availableCars).toContain(car3);
    expect(availableCars).not.toContain(car2);
    expect(availableCars).not.toContain(car4);
  });

  it('should return available cars when all 3 filters are applied', async () => {
    const sedanCategory = await categoryRepository.create({
      name: categoriesSeeds[0].name,
      description: categoriesSeeds[0].description,
    });

    const suvCategory = await categoryRepository.create({
      name: categoriesSeeds[1].name,
      description: categoriesSeeds[1].description,
    });

    const car1 = await carRepository.create({
      ...carsSeeds[0],
      model: 'Enzo',
      brand: 'Ferrari',
      category_id: sedanCategory.id,
    });

    const car2 = await carRepository.create({
      ...carsSeeds[1],
      model: 'Enzo',
      brand: 'Ferrari',
      category_id: sedanCategory.id,
    });

    const car3 = await carRepository.create({
      ...carsSeeds[2],
      model: 'F8',
      brand: 'Ferrari',
      category_id: sedanCategory.id,
    });

    const car4 = await carRepository.create({
      ...carsSeeds[3],
      model: 'A8',
      brand: 'Audi',
      category_id: suvCategory.id,
    });

    await carRepository.save({ ...car2, available: false });

    const availableCars = await listAvailableCarsUseCase.execute({
      category_id: sedanCategory.id,
      brand: 'ferrari',
      model: 'enzo',
    });

    expect(availableCars).toContain(car1);
    expect(availableCars).not.toContain(car3);
    expect(availableCars).not.toContain(car2);
    expect(availableCars).not.toContain(car4);
  });
});
