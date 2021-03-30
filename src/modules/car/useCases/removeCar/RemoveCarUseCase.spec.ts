import 'reflect-metadata';

import { Engine, Transmission } from '@modules/car/models/enums';
import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { RemoveCarUseCase } from './RemoveCarUseCase';
import { RegisterCarUseCase } from '../registerCar/RegisterCarUseCase';

describe('RemoveCarUseCase', () => {
  let removeCarUseCase: RemoveCarUseCase;

  let registerCarUseCase: RegisterCarUseCase;

  let carRepository: FakeCarRepository;

  const carParams = {
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

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    removeCarUseCase = new RemoveCarUseCase(carRepository);

    registerCarUseCase = new RegisterCarUseCase(carRepository);
  });

  it('ensures car exists in the database to be removed', async () => {
    await expect(
      removeCarUseCase.execute('non existent car id'),
    ).rejects.toHaveProperty('message', 'no car found for the given id');
  });

  it('ensures car is removed from the database', async () => {
    const newCar = await registerCarUseCase.execute(carParams);

    await expect(removeCarUseCase.execute(newCar.id)).resolves.toBeUndefined();

    const carExists = await carRepository.findById(newCar.id);

    expect(carExists).toBeUndefined();
  });
});
