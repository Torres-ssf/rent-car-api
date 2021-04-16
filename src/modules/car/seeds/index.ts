import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { ListAvailableCarsDTO } from '../dtos/ListAvailableCarsDTO';
import { TypeormCar } from '../entities/TypeormCar';

export const createDummyCars = async (
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
