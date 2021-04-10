import { getHours, isBefore, isSameDay, startOfDay } from 'date-fns';
import { ICarRepository } from '@modules/car/repositories/ICarRepository';
import { AppError } from '@shared/errors/AppError';
import { IUserRepository } from '@modules/user/repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';
import { ClientSideCreateRentalDTO } from '@modules/rental/dtos/ClientSideCreateRentalDTO';
import { Rental } from '../../models/Rental';
import { IRentalRepository } from '../../repositories/IRentalRepository';

@injectable()
export class CreateRentalUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
  ) {}

  async execute(
    clientSideCreateRentalDTO: ClientSideCreateRentalDTO,
  ): Promise<Rental> {
    const {
      user_id,
      car_id,
      start_date,
      expected_return_date,
    } = clientSideCreateRentalDTO;

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('No user was found for the given id');
    }

    const openRentalForUser = await this.rentalRepository.findOpenRentalForUser(
      user.id,
    );

    if (openRentalForUser) {
      throw new AppError('There is an open rental for the given user');
    }

    const carExists = await this.carRepository.findById(car_id);

    if (!carExists) {
      throw new AppError('No car found for the given id');
    }

    if (!carExists.available) {
      throw new AppError('Given car is not available');
    }

    if (isBefore(startOfDay(start_date), startOfDay(Date.now()))) {
      throw new AppError('Cannot create rental for a past date');
    }

    if (!isSameDay(start_date, Date.now())) {
      throw new AppError('Cannot create rental for a future date');
    }

    if (isBefore(startOfDay(expected_return_date), startOfDay(Date.now()))) {
      throw new AppError('Return date cannot be a past date');
    }

    // if (isBefore(end_date, start_date)) {
    //   throw new AppError(`the end date can't be before the starting date`);
    // }

    // if (isSameDay(start_date, end_date)) {
    //   throw new AppError(`car rent period needs to be at least 1 day`);
    // }

    // if (isSameDay(start_date, Date.now())) {
    //   const hour = getHours(Date.now());

    //   if (hour >= 20) {
    //     throw new AppError(
    //       `rent store is close right now, try schedule a rent for tomorrow`,
    //     );
    //   }
    // }

    // const car = await this.carRepository.findById(car_id);

    // if (!car) {
    //   throw new AppError('no car was found for the given id');
    // }

    // const rentalExists = await this.rentalRepository.findByCarIdAndDate({
    //   car_id,
    //   start_date,
    //   end_date,
    // });

    // if (rentalExists.length) {
    //   throw new Error('car rental period conflicts with other existent rental');
    // }

    // const rental = Object.assign(new Rental(), {
    //   car_id,
    //   client_id,
    //   start_date,
    //   end_date,
    //   created_at: Date.now(),
    //   updated_at: Date.now(),
    // });

    return new Rental();
  }
}
