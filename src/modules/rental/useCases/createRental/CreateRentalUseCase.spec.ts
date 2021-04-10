import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { FakeUserRepository } from '@modules/user/repositories/fakes/FakeUserRepository';

import { FakeCategoryRepository } from '@modules/car/repositories/fakes/FakeCategoryRepository';
import { CreateRentalUseCase } from './CreateRentalUseCase';
import { FakeRentalRepository } from '../../repositories/fakes/FakeRentalRepository';

describe('CreateRentalUseCase', () => {
  let createRentalUseCase: CreateRentalUseCase;

  let rentalRepository: FakeRentalRepository;

  let carRepository: FakeCarRepository;

  let userRepository: FakeUserRepository;

  let categoryRepository: FakeCategoryRepository;

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
    categoryRepository = new FakeCategoryRepository();

    carRepository = new FakeCarRepository();

    rentalRepository = new FakeRentalRepository();

    userRepository = new FakeUserRepository();

    createRentalUseCase = new CreateRentalUseCase(
      userRepository,
      carRepository,
      rentalRepository,
    );
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
    const newCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: newCategory.id,
    });

    const newUser = await userRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: 'a123123FSS',
      driver_license: '12312343',
    });

    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await rentalRepository.create({
      car_id: newCar.id,
      user_id: newUser.id,
      start_date: new Date(2021, 1, 10),
      expected_return_date: new Date(2021, 1, 12),
      car_daily_value: newCar.daily_value,
      car_daily_fine: newCar.fine_amount,
      estimated_total: newCar.daily_value * 2,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: newCar.id,
        user_id: newUser.id,
        start_date: new Date(2021, 1, 13),
        expected_return_date: new Date(2021, 1, 14),
      }),
    ).rejects.toHaveProperty(
      'message',
      'There is an open rental for the given user',
    );
  });

  it('should not allow a user to rent a nonexistent car', async () => {
    const newUser = await userRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: 'a123123FSS',
      driver_license: '12312343',
    });

    await expect(
      createRentalUseCase.execute({
        car_id: 'nonexistent car id',
        user_id: newUser.id,
        start_date: new Date(),
        expected_return_date: new Date(),
      }),
    ).rejects.toHaveProperty('message', 'No car found for the given id');
  });

  it('should not allow a user to rent an unavailable car', async () => {
    const newCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: newCategory.id,
    });

    await carRepository.save({ ...newCar, available: false });

    const newUser = await userRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: 'a123123FSS',
      driver_license: '12312343',
    });

    await expect(
      createRentalUseCase.execute({
        car_id: newCar.id,
        user_id: newUser.id,
        start_date: new Date(),
        expected_return_date: new Date(),
      }),
    ).rejects.toHaveProperty('message', 'Given car is not available');
  });

  it('should not allow a car to be rented on a past day', async () => {
    const newCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: newCategory.id,
    });
    const newUser = await userRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: 'a123123FSS',
      driver_license: '12312343',
    });

    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: newCar.id,
        user_id: newUser.id,
        start_date: new Date(2021, 1, 9),
        expected_return_date: new Date(),
      }),
    ).rejects.toHaveProperty('message', 'Cannot create rental for a past date');
  });

  it('should not allow a car to be rented on a future date', async () => {
    const newCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: newCategory.id,
    });
    const newUser = await userRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: 'a123123FSS',
      driver_license: '12312343',
    });

    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: newCar.id,
        user_id: newUser.id,
        start_date: new Date(2021, 1, 11),
        expected_return_date: new Date(),
      }),
    ).rejects.toHaveProperty(
      'message',
      'Cannot create rental for a future date',
    );
  });

  it('should not allow the return date to be a past date', async () => {
    const newCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: newCategory.id,
    });
    const newUser = await userRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: 'a123123FSS',
      driver_license: '12312343',
    });

    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: newCar.id,
        user_id: newUser.id,
        start_date: new Date(2021, 1, 10),
        expected_return_date: new Date(2021, 1, 5),
      }),
    ).rejects.toHaveProperty('message', 'Return date cannot be a past date');
  });

  it('should not allow car be rent for a period last than one day', async () => {
    const newCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: newCategory.id,
    });
    const newUser = await userRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: 'a123123FSS',
      driver_license: '12312343',
    });

    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: newCar.id,
        user_id: newUser.id,
        start_date: new Date(2021, 1, 10),
        expected_return_date: new Date(2021, 1, 10),
      }),
    ).rejects.toHaveProperty(
      'message',
      'Return date cannot be at the same day as the start date',
    );
  });

  it('should create a rental if right credentials are passed', async () => {
    const newCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    const newCar = await carRepository.create({
      ...carParams,
      category_id: newCategory.id,
    });
    const newUser = await userRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: 'a123123FSS',
      driver_license: '12312343',
    });

    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      createRentalUseCase.execute({
        car_id: newCar.id,
        user_id: newUser.id,
        start_date: new Date(2021, 1, 10),
        expected_return_date: new Date(2021, 1, 14),
      }),
    ).resolves.toBeTruthy();
  });

  // it('should not be possible for the end date happens before the starting date', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

  //   await expect(
  //     rentCarUseCase.execute({
  //       car_id: '1',
  //       user_id: '1',
  //       start_date: new Date(2021, 1, 26),
  //       expected_return_date: new Date(2021, 1, 12),
  //     }),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     "the end date can't be before the starting date",
  //   );
  // });

  // it('should not be possible for start date and end date be on the same day', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

  //   await expect(
  //     rentCarUseCase.execute({
  //       car_id: '1',
  //       user_id: '1',
  //       start_date: new Date(2021, 1, 12),
  //       expected_return_date: new Date(2021, 1, 12),
  //     }),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     'car rent period needs to be at least 1 day',
  //   );
  // });

  // it('should not be possible to rent a car for the same day after 6pm', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 11, 20).getTime());

  //   await expect(
  //     rentCarUseCase.execute({
  //       car_id: '1',
  //       user_id: '1',
  //       start_date: new Date(2021, 1, 11, 20),
  //       expected_return_date: new Date(2021, 1, 14),
  //     }),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     'rent store is close right now, try schedule a rent for tomorrow',
  //   );
  // });

  // it('should verify if user exists for the given id', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 11).getTime());

  //   await expect(
  //     rentCarUseCase.execute({
  //       car_id: '1',
  //       user_id: 'nonExistentUser',
  //       start_date: new Date(2021, 1, 12),
  //       expected_return_date: new Date(2021, 1, 14),
  //     }),
  //   ).rejects.toHaveProperty('message', 'no user was found for the given id');
  // });

  // it('should verify if car exists for the given id', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 11).getTime());

  //   const user = usersSeed[0];

  //   await userRepository.save(
  //     Object.assign(new User(), {
  //       ...user,
  //     }),
  //   );

  //   await expect(
  //     rentCarUseCase.execute({
  //       car_id: 'nonExistentCarId',
  //       user_id: user.id,
  //       start_date: new Date(2021, 1, 12),
  //       expected_return_date: new Date(2021, 1, 14),
  //     }),
  //   ).rejects.toHaveProperty('message', 'no car was found for the given id');
  // });

  // it('should verify if date conflict with an existent contract', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 11).getTime());

  //   const car = carsSeed[0];

  //   await carRepository.save(
  //     Object.assign(new Car(), {
  //       ...car,
  //     }),
  //   );

  //   const user = usersSeed[0];

  //   await userRepository.save(
  //     Object.assign(new User(), {
  //       ...user,
  //     }),
  //   );

  //   rentalRepository.rentals.push(
  //     Object.assign(new Rental(), {
  //       car_id: car.id,
  //       client_id: user.id,
  //       start_date: new Date(2021, 1, 12),
  //       end_date: new Date(2021, 1, 15),
  //       created_at: new Date(2021, 1, 8),
  //       updated_at: new Date(2021, 1, 8),
  //     }),
  //   );

  //   rentalRepository.rentals.push(
  //     Object.assign(new Rental(), {
  //       car_id: car.id,
  //       client_id: user.id,
  //       start_date: new Date(2021, 1, 21),
  //       end_date: new Date(2021, 1, 24),
  //       created_at: new Date(2021, 1, 8),
  //       updated_at: new Date(2021, 1, 8),
  //     }),
  //   );

  //   await expect(
  //     rentCarUseCase.execute({
  //       car_id: car.id,
  //       user_id: user.id,
  //       start_date: new Date(2021, 1, 15),
  //       expected_return_date: new Date(2021, 1, 20),
  //     }),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     'car rental period conflicts with other existent rental',
  //   );

  //   await expect(
  //     rentCarUseCase.execute({
  //       car_id: car.id,
  //       user_id: user.id,
  //       start_date: new Date(2021, 1, 16),
  //       expected_return_date: new Date(2021, 1, 22),
  //     }),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     'car rental period conflicts with other existent rental',
  //   );
  // });

  // it('should be possible to create a rental data', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 11).getTime());

  //   const car = carsSeed[0];

  //   await carRepository.save(
  //     Object.assign(new Car(), {
  //       ...car,
  //     }),
  //   );

  //   const user = usersSeed[0];

  //   await userRepository.save(
  //     Object.assign(new User(), {
  //       ...user,
  //     }),
  //   );

  //   await expect(
  //     rentCarUseCase.execute({
  //       car_id: car.id,
  //       user_id: user.id,
  //       start_date: new Date(2021, 1, 12),
  //       expected_return_date: new Date(2021, 1, 14),
  //     }),
  //   ).resolves.toBeTruthy();
  // });
});
