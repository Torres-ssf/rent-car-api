import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { FakeCarImageRepository } from '@modules/carImage/repositories/fakes/FakeCarImageRepository';
import { FakeCategoryRepository } from '@modules/car/repositories/fakes/FakeCategoryRepository';
import { UploadCarImageUseCase } from './UploadCarImageUseCase';

describe('UploadCarUseCase', () => {
  let uploadCarImageUseCase: UploadCarImageUseCase;

  let carRepository: FakeCarRepository;

  let categoryRepository: FakeCategoryRepository;

  let carImageRepository: FakeCarImageRepository;

  const carParams1 = {
    model: 'F8',
    brand: 'Ferrari',
    license_plate: '1234-SDA',
    max_speed: 340,
    horse_power: 720,
    zero_to_one_hundred: 2.9,
    passengers: 2,
    daily_value: 900,
    fine_amount: 200,
  };

  beforeEach(() => {
    carRepository = new FakeCarRepository();

    carImageRepository = new FakeCarImageRepository();

    uploadCarImageUseCase = new UploadCarImageUseCase(
      carRepository,
      carImageRepository,
    );
  });

  it('should verify if car exists', async () => {
    await expect(
      uploadCarImageUseCase.execute({
        car_id: 'non-existent-car',
        images_names: ['image1'],
      }),
    ).rejects.toHaveProperty('message', 'No car found for the given id');
  });
});
