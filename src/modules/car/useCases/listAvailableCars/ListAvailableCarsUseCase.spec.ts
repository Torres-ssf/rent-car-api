import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { Engine, Transmission } from '@modules/car/enums';
import { Car } from '@modules/car/models/Car';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';
import carSeed from '../../seeds/cars.json';

describe('ListCarUseCase', () => {
  let listAvailableCarsUseCase: ListAvailableCarsUseCase;

  let carRepository: FakeCarRepository;

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carRepository);
  });

  // it('should verify if start_date is not a past date', async () => {
  //   await expect(
  //     listAvailableCarsUseCase.execute({
  //       start_date: new Date(2020, 8, 10),
  //       end_date: new Date(),
  //     }),
  //   ).rejects.toHaveProperty('message', "start date can't be a past date");
  // });

  // it('should verify if end_date does not come before start_date', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

  //   await expect(
  //     listAvailableCarsUseCase.execute({
  //       start_date: new Date(2021, 2, 10),
  //       end_date: new Date(2021, 2, 9),
  //     }),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     "the end date can't be before the start date",
  //   );
  // });

  // it('should verify if end_date does not come before start_date', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

  //   await expect(
  //     listAvailableCarsUseCase.execute({
  //       start_date: new Date(2021, 2, 10),
  //       end_date: new Date(2021, 2, 10),
  //     }),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     "start date and end date can't be at the same day",
  //   );
  // });

  // it('should return an array of cars', async () => {
  //   global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

  //   const newCar = new Car();

  //   Object.assign(newCar, {
  //     ...carSeed[0],
  //     engine: carSeed[0].engine as Engine,
  //     transmission: carSeed[0].transmission as Transmission,
  //     created_at: new Date(carSeed[0].created_at),
  //     updated_at: new Date(carSeed[0].updated_at),
  //   });

  //   await carRepository.save(newCar);

  //   const res = await listAvailableCarsUseCase.execute({
  //     start_date: new Date(2021, 2, 10),
  //     end_date: new Date(2021, 2, 12),
  //   });

  //   expect(res instanceof Array).toBeTruthy();
  //   expect(res.length).toBe(1);
  //   expect(res[0] instanceof Car).toBeTruthy();
  // });
});
