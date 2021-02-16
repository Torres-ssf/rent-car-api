import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

describe('ListCarUseCase', () => {
  let listAvailableCarsUseCase: ListAvailableCarsUseCase;

  let carRepository: FakeCarRepository;

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carRepository);
  });

  it('should verify if start_date is not a past date', async () => {
    await expect(
      listAvailableCarsUseCase.execute({
        start_date: new Date(2020, 8, 10),
        end_date: new Date(),
      }),
    ).rejects.toHaveProperty('message', "start date can't be a past date");
  });

  it('should verify if end_date does not come before start_date', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await expect(
      listAvailableCarsUseCase.execute({
        start_date: new Date(2021, 2, 10),
        end_date: new Date(2021, 2, 9),
      }),
    ).rejects.toHaveProperty(
      'message',
      "the end date can't be before the start date",
    );
  });
});
