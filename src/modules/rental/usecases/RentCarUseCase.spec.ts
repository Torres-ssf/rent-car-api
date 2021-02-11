import 'reflect-metadata';
import MockDate from 'mockdate';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { RentCarUseCase } from './RentCarUseCase';
import { FakeRentalRepository } from '../repositories/fakes/FakeRentalRepository';

describe('ListCarUseCase', () => {
  let rentCarUseCase: RentCarUseCase;

  let rentalRepository: FakeRentalRepository;

  let carRepository: FakeCarRepository;

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    rentalRepository = new FakeRentalRepository();

    rentCarUseCase = new RentCarUseCase(carRepository, rentalRepository);
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
    MockDate.set('2021-01-10');

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
});
