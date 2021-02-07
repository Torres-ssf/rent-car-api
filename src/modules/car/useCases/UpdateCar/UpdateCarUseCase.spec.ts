import 'reflect-metadata';

import { Engine, Transmission } from '@modules/car/models/enums';
import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { Car } from '@modules/car/models/Car';
import { UpdateCarUseCase } from './UpdateCarUseCase';

describe('UpdateCarUseCase', () => {
  let updateCarUseCase: UpdateCarUseCase;

  let carRepository: FakeCarRepository;

  const carParams1 = {
    model: 'F8',
    brand: 'Ferrari',
    max_speed: 340,
    horse_power: 720,
    zero_to_one_hundred: 2.9,
    engine: Engine.Gas,
    transmission: Transmission.Automatic,
    passengers: 2,
    daily_value: 900,
  };

  const carParams2 = {
    model: 'Aventador',
    brand: 'Lamborghini',
    max_speed: 350,
    horse_power: 770,
    zero_to_one_hundred: 2.8,
    engine: Engine.Gas,
    transmission: Transmission.Automatic,
    passengers: 2,
    daily_value: 1100,
  };

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    updateCarUseCase = new UpdateCarUseCase(carRepository);
  });

  it('ensures car exists in the database to be updated', async () => {
    await expect(
      updateCarUseCase.execute('non existent car id', {
        model: 'New Beatle',
      }),
    ).rejects.toHaveProperty('message', 'no car found for the given id');
  });

  it('ensures all given properties are properly updated', async () => {
    const newCar = await carRepository.save(
      Object.assign(new Car(), carParams1),
    );

    await expect(
      updateCarUseCase.execute(newCar.id, carParams2),
    ).resolves.toMatchObject(carParams2);
  });
});
