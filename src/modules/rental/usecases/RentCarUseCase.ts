import { getHours, isBefore, isSameDay } from 'date-fns';
import { ICarRepository } from '@modules/car/repositories/ICarRepository';
import { AppError } from '@shared/errors/AppError';
import { IUserRepository } from '@modules/user/repositories/IUserRepository';
import { Rental } from '../models/Rental';
import { IRentalRepository } from '../repositories/IRentalRepository';
import { RentCarDTO } from './RentCarDTO';

export class RentCarUseCase {
  constructor(
    private userRepository: IUserRepository,
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

    if (isSameDay(start_date, end_date)) {
      throw new AppError(`car rent period needs to be at least 1 day`);
    }

    if (isSameDay(start_date, Date.now())) {
      const hour = getHours(Date.now());

      if (hour >= 20) {
        throw new AppError(
          `rent store is close right now, try schedule a rent for tomorrow`,
        );
      }
    }

    const user = await this.userRepository.findById(client_id);

    if (!user) {
      throw new AppError('no user was found for the given id');
    }

    return new Rental();
  }
}
