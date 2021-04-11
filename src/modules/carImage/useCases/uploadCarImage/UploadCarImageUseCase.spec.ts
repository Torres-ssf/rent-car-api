import 'reflect-metadata';

import { FakeCarRepository } from '@modules/car/repositories/fakes/FakeCarRepository';
import { FakeCarImageRepository } from '@modules/carImage/repositories/fakes/FakeCarImageRepository';
import { FakeCategoryRepository } from '@modules/category/repositories/fakes/FakeCategoryRepository';
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

    categoryRepository = new FakeCategoryRepository();

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

  it('should save all car images', async () => {
    const category = await categoryRepository.create({
      name: 'Dummy Category',
      description: 'This is a dummy category',
    });

    const car = await carRepository.create({
      ...carParams1,
      category_id: category.id,
    });

    const [
      carImage1,
      carImage2,
      carImage3,
    ] = await uploadCarImageUseCase.execute({
      car_id: car.id,
      images_names: ['image1', 'image2', 'image3'],
    });

    expect(carImage1).toHaveProperty('car_id', car.id);
    expect(carImage1).toHaveProperty('image_name', 'image1');
    expect(carImage2).toHaveProperty('car_id', car.id);
    expect(carImage2).toHaveProperty('image_name', 'image2');
    expect(carImage3).toHaveProperty('car_id', car.id);
    expect(carImage3).toHaveProperty('image_name', 'image3');
  });
});
