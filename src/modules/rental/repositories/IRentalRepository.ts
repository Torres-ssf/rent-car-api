import { CreateRentalDTO } from '../dtos/CreateRentalDTO';
import { Rental } from '../models/Rental';

export interface IRentalRepository {
  create(createRentalDTO: CreateRentalDTO): Promise<Rental>;
  findOpenRentalForCar(car_id: string): Promise<Rental | undefined>;
  findOpenRentalForUser(user_id: string): Promise<Rental | undefined>;
  save(rental: Rental): Promise<Rental>;
}
