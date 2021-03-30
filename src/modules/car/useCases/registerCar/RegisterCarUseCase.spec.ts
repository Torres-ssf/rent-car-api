import { Car } from '@modules/car/models/Car';
import { Engine, Transmission } from '@modules/car/enums';
import 'reflect-metadata';

import { FakeCarRepository } from '../../repositories/fakes/FakeCarRepository';
import { RegisterCarUseCase } from './RegisterCarUseCase';

describe('RegisterCarUseCase', () => {
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

    registerCarUseCase = new RegisterCarUseCase(carRepository);
  });

  it('ensures that all cars properties were properly assigned to the new car object', async () => {
    const res = await registerCarUseCase.execute(carParams);

    expect(res).toHaveProperty('id');
    expect(res.id.length).toBeTruthy();
    expect(res).toHaveProperty('model', 'F8');
    expect(res).toHaveProperty('brand', 'Ferrari');
    expect(res).toHaveProperty('max_speed', 340);
    expect(res).toHaveProperty('horse_power', 720);
    expect(res).toHaveProperty('zero_to_one_hundred', 2.9);
    expect(res).toHaveProperty('engine', 'GAS');
    expect(res).toHaveProperty('transmission', 'AUTOMATIC');
    expect(res).toHaveProperty('passengers', 2);
    expect(res).toHaveProperty('daily_value', 900);
    expect(res).toHaveProperty('created_at');
    expect(res).toHaveProperty('updated_at');
  });

  it('ensure new registered car is saved into the database', async () => {
    const res = await registerCarUseCase.execute(carParams);

    const carInDabase = (await carRepository.findById(res.id)) as Car;

    expect(res).toMatchObject(carInDabase);
  });
});
