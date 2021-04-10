import { CreateRentalDTO } from '../dtos/CreateRentalDTO';
import { Rental } from '../models/Rental';

export interface IRentalRepository {
  create(createRentalDTO: CreateRentalDTO): Promise<Rental>;
  findOpenRentalForCar(carId: string): Promise<Rental | undefined>;
  findOpenRentalForUser(userId: string): Promise<Rental | undefined>;
  save(rental: Rental): Promise<Rental>;
}
