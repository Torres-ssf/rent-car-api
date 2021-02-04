import 'reflect-metadata';

import { FakeCarRepository } from '../../repositories/fakes/FakeCarRepository';
import { RegisterCarUseCase } from './RegisterCarUseCase';

describe('RegisterCarUseCase', () => {
  let registerCarUseCase: RegisterCarUseCase;

  let carRepository: FakeCarRepository;

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    registerCarUseCase = new RegisterCarUseCase(carRepository);
  });

  it('should return a new car object with the correct values provided', async () => {
    await expect(
      registerCarUseCase.execute({
        name: 'v8',
        brand: 'Ferrari',
        dailyValue: 800,
      }),
    ).resolves.toMatchObject({
      name: 'v8',
      brand: 'Ferrari',
      dailyValue: 800,
    });
  });
});
