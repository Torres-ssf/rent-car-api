import { Rental } from '@modules/rental/models/Rental';
import { IRentalRepository } from '../IRentalRepository';

export class FakeRentalRepository implements IRentalRepository {
  private rentals: Rental[] = [];

  async save(rental: Rental): Promise<Rental> {
    this.rentals.push(rental);
    return rental;
  }

  findByCarId(carId: string): Promise<Rental> {
    throw new Error('Method not implemented.');
  }

  findByUserId(userId: string): Promise<Rental> {
    throw new Error('Method not implemented.');
  }
}
