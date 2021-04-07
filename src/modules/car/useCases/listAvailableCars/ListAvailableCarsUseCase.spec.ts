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

  const carParams = {
    model: 'F8',
    brand: 'Ferrari',
    max_speed: 340,
    horse_power: 720,
    zero_to_one_hundred: 2.9,
    daily_value: 800,
    fine_amount: 200,
  };

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

  it('should return only available cars', async () => {
    const newCategory = await categoryRepository.create({
      name: 'Dummy Category',
      description: 'This is a dummy category',
    });

    const car1 = await carRepository.create({
      ...carParams,
      license_plate: '1231-KSD',
      category_id: newCategory.id,
    });

    const car2 = await carRepository.create({
      ...carParams,
      license_plate: '9689-MVB',
      category_id: newCategory.id,
    });

    const car3 = await carRepository.create({
      ...carParams,
      license_plate: '1653-LKJ',
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
      name: 'SUV',
      description: 'Sport Utility Vehicle',
    });

    const sedanCategory = await categoryRepository.create({
      name: 'Sedan',
      description: 'Four doors and a traditional trunk',
    });

    const car1 = await carRepository.create({
      ...carParams,
      license_plate: '1231-KSD',
      category_id: suvCategory.id,
    });

    const car2 = await carRepository.create({
      ...carParams,
      license_plate: '9689-MVB',
      category_id: suvCategory.id,
    });

    const car3 = await carRepository.create({
      ...carParams,
      license_plate: '1653-LKJ',
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
      name: 'Sedan',
      description: 'Four doors and a traditional trunk',
    });

    const car1 = await carRepository.create({
      ...carParams,
      model: 'Enzo',
      license_plate: '1231-KSD',
      category_id: sedanCategory.id,
    });

    const car2 = await carRepository.create({
      ...carParams,
      model: 'F8',
      license_plate: '9689-MVB',
      category_id: sedanCategory.id,
    });

    const car3 = await carRepository.create({
      ...carParams,
      model: 'SF90',
      license_plate: '1653-LKJ',
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
      name: 'Sedan',
      description: 'Four doors and a traditional trunk',
    });

    const car1 = await carRepository.create({
      ...carParams,
      brand: 'Ferrari',
      license_plate: '1231-KSD',
      category_id: sedanCategory.id,
    });

    const car2 = await carRepository.create({
      ...carParams,
      brand: 'Ferrari',
      license_plate: '9689-MVB',
      category_id: sedanCategory.id,
    });

    const car3 = await carRepository.create({
      ...carParams,
      brand: 'Ferrari',
      license_plate: '9689-MVB',
      category_id: sedanCategory.id,
    });

    const car4 = await carRepository.create({
      ...carParams,
      brand: 'Audi',
      license_plate: '1653-LKJ',
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
});
