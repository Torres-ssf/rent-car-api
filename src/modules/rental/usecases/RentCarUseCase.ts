import { isBefore, isSameDay } from 'date-fns';
import { ICarRepository } from '@modules/car/repositories/ICarRepository';
import { AppError } from '@shared/errors/AppError';
import { Rental } from '../models/Rental';
import { IRentalRepository } from '../repositories/IRentalRepository';
import { RentCarDTO } from './RentCarDTO';

export class RentCarUseCase {
  constructor(
    private carRepository: ICarRepository,
    private rentalRepository: IRentalRepository,
  ) {}

  /*
    To rent a car I should verify
    - If the start date is not on the past (after 6 pm should not be possible for the current day)

    - If the end date is at least one day after the start date.

    - If the car id exists.

    - If the car is available in the given period

    - If the user exists.
  */

  async execute(rentCarDTO: RentCarDTO): Promise<Rental> {
    const { car_id, client_id, start_date, end_date } = rentCarDTO;

    if (isBefore(start_date, new Date())) {
      throw new AppError(`you can't rent a car on a past date`);
    }

    if (isBefore(end_date, start_date)) {
      throw new AppError(`the end date can't be before the starting date`);
    }

    return new Rental();
  }
}
