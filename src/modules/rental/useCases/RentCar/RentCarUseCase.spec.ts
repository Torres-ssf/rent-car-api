import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { FakeUserRepository } from '@modules/user/repositories/fakes/FakeUserRepository';
import usersSeed from '@modules/user/seeds/users.json';
import carsSeed from '@modules/car/seeds/cars.json';
import { User } from '@modules/user/models/User';
import { Car } from '@modules/car/models/Car';
import { RentCarUseCase } from './RentCarUseCase';
import { FakeRentalRepository } from '../../repositories/fakes/FakeRentalRepository';
import { Rental } from '../../models/Rental';

describe('ListCarUseCase', () => {
  let rentCarUseCase: RentCarUseCase;

  let rentalRepository: FakeRentalRepository;

  let carRepository: FakeCarRepository;

  let userRepository: FakeUserRepository;

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    rentalRepository = new FakeRentalRepository();

    userRepository = new FakeUserRepository();

    rentCarUseCase = new RentCarUseCase(
      userRepository,
      carRepository,
      rentalRepository,
    );
  });

  it('should not be possible to rent a car in a past date', async () => {
    await expect(
      rentCarUseCase.execute({
        car_id: '1',
        client_id: '1',
        start_date: new Date(1987, 1, 11),
        end_date: new Date(1989, 6, 10),
      }),
    ).rejects.toHaveProperty('message', "you can't rent a car on a past date");
  });

  it('should not be possible for the end date happens before the starting date', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      rentCarUseCase.execute({
        car_id: '1',
        client_id: '1',
        start_date: new Date(2021, 1, 26),
        end_date: new Date(2021, 1, 12),
      }),
    ).rejects.toHaveProperty(
      'message',
      "the end date can't be before the starting date",
    );
  });

  it('should not be possible for start date and end date be on the same day', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      rentCarUseCase.execute({
        car_id: '1',
        client_id: '1',
        start_date: new Date(2021, 1, 12),
        end_date: new Date(2021, 1, 12),
      }),
    ).rejects.toHaveProperty(
      'message',
      'car rent period needs to be at least 1 day',
    );
  });

  it('should not be possible to rent a car for the same day after 6pm', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 11, 20).getTime());

    await expect(
      rentCarUseCase.execute({
        car_id: '1',
        client_id: '1',
        start_date: new Date(2021, 1, 11, 20),
        end_date: new Date(2021, 1, 14),
      }),
    ).rejects.toHaveProperty(
      'message',
      'rent store is close right now, try schedule a rent for tomorrow',
    );
  });

  it('should verify if user exists for the given id', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 11).getTime());

    await expect(
      rentCarUseCase.execute({
        car_id: '1',
        client_id: 'nonExistentUser',
        start_date: new Date(2021, 1, 12),
        end_date: new Date(2021, 1, 14),
      }),
    ).rejects.toHaveProperty('message', 'no user was found for the given id');
  });

  it('should verify if car exists for the given id', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 11).getTime());

    const user = usersSeed[0];

    await userRepository.save(
      Object.assign(new User(), {
        ...user,
      }),
    );

    await expect(
      rentCarUseCase.execute({
        car_id: 'nonExistentCarId',
        client_id: user.id,
        start_date: new Date(2021, 1, 12),
        end_date: new Date(2021, 1, 14),
      }),
    ).rejects.toHaveProperty('message', 'no car was found for the given id');
  });

  it('should verify if date conflict with an existent contract', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 11).getTime());

    const car = carsSeed[0];

    await carRepository.save(
      Object.assign(new Car(), {
        ...car,
      }),
    );

    const user = usersSeed[0];

    await userRepository.save(
      Object.assign(new User(), {
        ...user,
      }),
    );

    rentalRepository.rentals.push(
      Object.assign(new Rental(), {
        car_id: car.id,
        client_id: user.id,
        start_date: new Date(2021, 1, 12),
        end_date: new Date(2021, 1, 15),
        created_at: new Date(2021, 1, 8),
        updated_at: new Date(2021, 1, 8),
      }),
    );

    rentalRepository.rentals.push(
      Object.assign(new Rental(), {
        car_id: car.id,
        client_id: user.id,
        start_date: new Date(2021, 1, 21),
        end_date: new Date(2021, 1, 24),
        created_at: new Date(2021, 1, 8),
        updated_at: new Date(2021, 1, 8),
      }),
    );

    await expect(
      rentCarUseCase.execute({
        car_id: car.id,
        client_id: user.id,
        start_date: new Date(2021, 1, 15),
        end_date: new Date(2021, 1, 20),
      }),
    ).rejects.toHaveProperty(
      'message',
      'car rental period conflicts with other existent rental',
    );

    await expect(
      rentCarUseCase.execute({
        car_id: car.id,
        client_id: user.id,
        start_date: new Date(2021, 1, 16),
        end_date: new Date(2021, 1, 22),
      }),
    ).rejects.toHaveProperty(
      'message',
      'car rental period conflicts with other existent rental',
    );
  });

  it('should be possible to create a rental data', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 11).getTime());

    const car = carsSeed[0];

    await carRepository.save(
      Object.assign(new Car(), {
        ...car,
      }),
    );

    const user = usersSeed[0];

    await userRepository.save(
      Object.assign(new User(), {
        ...user,
      }),
    );

    await expect(
      rentCarUseCase.execute({
        car_id: car.id,
        client_id: user.id,
        start_date: new Date(2021, 1, 12),
        end_date: new Date(2021, 1, 14),
      }),
    ).resolves.toBeTruthy();
  });
});
