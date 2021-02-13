import { Rental } from '../models/Rental';
import { IFindByCarAndDate } from '../dtos/IFindByCarAndDate';

export interface IRentalRepository {
  save(rental: Rental): Promise<Rental>;
  findByCarIdAndDate(data: IFindByCarAndDate): Promise<Rental[]>;
  findByUserId(userId: string): Promise<Rental>;
}
