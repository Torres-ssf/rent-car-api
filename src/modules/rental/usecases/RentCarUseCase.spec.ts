import 'reflect-metadata';

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
        start_date: new Date(1989, 6, 10),
        end_date: new Date(1987, 1, 11),
      }),
    ).rejects.toHaveProperty('message', "you can't rent a car for a past date");
  });
});
