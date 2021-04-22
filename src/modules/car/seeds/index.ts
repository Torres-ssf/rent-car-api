import { Specification } from '@modules/specification/models/Specification';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { ListAvailableCarsDTO } from '../dtos/ListAvailableCarsDTO';
import { TypeormCar } from '../entities/TypeormCar';
import { ICarRepository } from '../repositories/ICarRepository';

export const createManyDummyCars = async (
  connection: Connection,
  { model = 'Dummy Model', brand = 'Dummy', category_id }: ListAvailableCarsDTO,
  numberOfCars: number,
  numOfUnavailableCars: number,
): Promise<void> => {
  await connection
    .createQueryBuilder()
    .insert()
    .into(TypeormCar)
    .values(
      Array.from({ length: numberOfCars }, (_, index) => {
        return {
          id: v4(),
          model,
          brand,
          license_plate: v4(),
          max_speed: 333,
          horse_power: 650,
          zero_to_one_hundred: 4.3,
          available: index >= numOfUnavailableCars,
          daily_value: 400,
          fine_amount: 150,
          category_id,
        };
      }),
    )
    .execute();
};

export const createDummyCar = async (
  connection: Connection,
  categoryId: string,
  specifications: Specification[] = [],
): Promise<string> => {
  const repository = container.resolve<ICarRepository>('CarRepository');

  const newCar = await repository.create({
    model: 'Dummy',
    brand: 'Dummy Model',
    license_plate: v4(),
    max_speed: 333,
    horse_power: 650,
    zero_to_one_hundred: 4.3,
    daily_value: 400,
    fine_amount: 150,
    category_id: categoryId,
  });

  if (specifications.length) {
    newCar.specifications = specifications;
    await repository.save(newCar);
  }

  return newCar.id;
};
