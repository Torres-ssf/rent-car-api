import { IFindByCarAndDate } from '@modules/rental/dtos/IFindByCarAndDate';
import { Rental } from '@modules/rental/models/Rental';
import { IRentalRepository } from '../IRentalRepository';

export class FakeRentalRepository implements IRentalRepository {
  rentals: Rental[] = [];

  async save(rental: Rental): Promise<Rental> {
    this.rentals.push(rental);
    return rental;
  }

  async findByCarIdAndDate(data: IFindByCarAndDate): Promise<Rental[]> {
    const { car_id, start_date, end_date } = data;

    return this.rentals.filter(rental => {
      return (
        rental.car_id === car_id &&
        ((rental.start_date <= start_date && rental.end_date >= start_date) ||
          (rental.start_date >= start_date && rental.start_date <= end_date))
      );
    });
  }

  findByUserId(userId: string): Promise<Rental> {
    throw new Error('Method not implemented.');
  }
}
