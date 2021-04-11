import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { FakeUserRepository } from '@modules/user/repositories/fakes/FakeUserRepository';

import { FakeCategoryRepository } from '@modules/category/repositories/fakes/FakeCategoryRepository';
import { differenceInDays } from 'date-fns';
import { Car } from '@modules/car/models/Car';
import { Category } from '@modules/category/models/Category';
import { User } from '@modules/user/models/User';
import { FakeDateProvider } from '@shared/container/providers/DateProvider/fakes/FakeDateProvider';
import { CreateRentalUseCase } from './CreateRentalUseCase';
import { FakeRentalRepository } from '../../repositories/fakes/FakeRentalRepository';

describe('CreateRentalUseCase', () => {
  let createRentalUseCase: CreateRentalUseCase;

  let rentalRepository: FakeRentalRepository;

  let carRepository: FakeCarRepository;

  let userRepository: FakeUserRepository;

  let dateProvider: FakeDateProvider;

  let categoryRepository: FakeCategoryRepository;

  let category: Category;

  let car: Car;

  let user: User;

  beforeAll(async () => {
    categoryRepository = new FakeCategoryRepository();

    carRepository = new FakeCarRepository();

    rentalRepository = new FakeRentalRepository();

    userRepository = new FakeUserRepository();

    dateProvider = new FakeDateProvider();

    createRentalUseCase = new CreateRentalUseCase(
      userRepository,
      carRepository,
      rentalRepository,
      dateProvider,
    );

    category = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    car = await carRepository.create({
      model: 'F8',
      brand: 'Ferrari',
      max_speed: 340,
      horse_power: 720,
      zero_to_one_hundred: 2.9,
      license_plate: 'MWS-2123',
      daily_value: 900,
      fine_amount: 200,
      category_id: category.id,
    });

    user = await userRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: 'a123123FSS',
      driver_license: '12312343',
    });
  });

  afterEach(async () => {
    await rentalRepository.destroyAll();

    await carRepository.updateCarAvailability(car.id, true);
  });

  it('should not create rental if user does not exists', async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: 'nonexistent car',
        user_id: 'nonexistent user',
        start_date: new Date(),
        expected_return_date: new Date(),
      }),
    ).rejects.toHaveProperty('message', 'No user was found for the given id');
  });

  it('should not allow a user to rent more than one car at the same time', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await rentalRepository.create({
      car_id: car.id,
      user_id: user.id,
      start_date: new Date(2021, 1, 10),
      expected_return_date: new Date(2021, 1, 12),
      car_daily_value: car.daily_value,
      car_daily_fine: car.fine_amount,
      estimated_total: car.daily_value * 2,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: user.id,
        start_date: new Date(2021, 1, 13),
        expected_return_date: new Date(2021, 1, 14),
      }),
    ).rejects.toHaveProperty(
      'message',
      'There is an open rental for the given user',
    );
  });

  it('should not allow a user to rent a nonexistent car', async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: 'nonexistent car id',
        user_id: user.id,
        start_date: new Date(),
        expected_return_date: new Date(),
      }),
    ).rejects.toHaveProperty('message', 'No car found for the given id');
  });

  it('should not allow a user to rent an unavailable car', async () => {
    await carRepository.updateCarAvailability(car.id, false);

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: user.id,
        start_date: new Date(),
        expected_return_date: new Date(),
      }),
    ).rejects.toHaveProperty('message', 'Given car is not available');
  });

  it('should not allow a car to be rented on a past day', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: user.id,
        start_date: new Date(2021, 1, 9),
        expected_return_date: new Date(),
      }),
    ).rejects.toHaveProperty('message', 'Start date cannot be a past date');
  });

  it('should not allow a car to be rented on a future date', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: user.id,
        start_date: new Date(2021, 1, 11),
        expected_return_date: new Date(),
      }),
    ).rejects.toHaveProperty('message', 'Start date cannot a future date');
  });

  it('should not allow the return date to be a past date', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: user.id,
        start_date: new Date(2021, 1, 10),
        expected_return_date: new Date(2021, 1, 5),
      }),
    ).rejects.toHaveProperty('message', 'Return date cannot be a past date');
  });

  it('should not allow car be rent for a period last than one day', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: user.id,
        start_date: new Date(2021, 1, 10),
        expected_return_date: new Date(2021, 1, 10),
      }),
    ).rejects.toHaveProperty(
      'message',
      'Return date cannot be at the same day as the start date',
    );
  });

  it('should create a rental if right credentials are passed', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: user.id,
        start_date: new Date(2021, 1, 10),
        expected_return_date: new Date(2021, 1, 14),
      }),
    ).resolves.toBeTruthy();
  });

  it('should save the car daily value and fine value at the created rental', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: user.id,
      start_date: new Date(2021, 1, 10),
      expected_return_date: new Date(2021, 1, 14),
    });

    expect(rental.car_daily_value).toBe(car.daily_value);
    expect(rental.car_daily_fine).toBe(car.fine_amount);
  });

  it('should save the estimated total based in the car daily value', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: user.id,
      start_date: new Date(2021, 1, 10),
      expected_return_date: new Date(2021, 1, 14),
    });

    const rentDays = differenceInDays(
      rental.expected_return_date,
      rental.start_date,
    );

    expect(rental.estimated_total).toBe(car.daily_value * rentDays);
  });

  it('should update rented car to become unavailable', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await createRentalUseCase.execute({
      car_id: car.id,
      user_id: user.id,
      start_date: new Date(2021, 1, 10),
      expected_return_date: new Date(2021, 1, 14),
    });

    expect(car.available).toBeFalsy();
  });
});
