import { Rental } from '../models/Rental';

export interface IRentalRepository {
  save(rental: Rental): Promise<Rental>;
  findByCarId(carId: string): Promise<Rental>;
  findByUserId(userId: string): Promise<Rental>;
}
