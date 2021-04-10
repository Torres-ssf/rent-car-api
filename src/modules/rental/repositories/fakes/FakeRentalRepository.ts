import { CreateRentalDTO } from '@modules/rental/dtos/CreateRentalDTO';
import { Status } from '@modules/rental/enums/Status';
import { Rental } from '@modules/rental/models/Rental';
import { IRentalRepository } from '../IRentalRepository';

export class FakeRentalRepository implements IRentalRepository {
  private readonly rentals: Rental[] = [];

  async create(createRentalDTO: CreateRentalDTO): Promise<Rental> {
    const newRental = new Rental();

    Object.assign(newRental, {
      ...createRentalDTO,
      status: Status.Open,
    });

    this.rentals.push(newRental);

    return newRental;
  }

  async findOpenRentalForCar(carId: string): Promise<Rental | undefined> {
    return this.rentals.find(
      rental => rental.car_id === carId && rental.status === Status.Open,
    );
  }

  async findOpenRentalForUser(userId: string): Promise<Rental | undefined> {
    return this.rentals.find(
      rental => rental.user_id === userId && rental.status === Status.Open,
    );
  }

  async save(rental: Rental): Promise<Rental> {
    const rentalIndex = this.rentals.findIndex(
      eachRental => eachRental.id === rental.id,
    );

    if (rentalIndex > -1) {
      this.rentals[rentalIndex] = rental;
    } else {
      this.rentals.push(rental);
    }

    return rental;
  }
}
