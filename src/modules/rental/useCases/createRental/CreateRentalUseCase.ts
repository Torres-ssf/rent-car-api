import { getHours, isBefore, isSameDay } from 'date-fns';
import { ICarRepository } from '@modules/car/repositories/ICarRepository';
import { AppError } from '@shared/errors/AppError';
import { IUserRepository } from '@modules/user/repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';
import { Rental } from '../../models/Rental';
import { IRentalRepository } from '../../repositories/IRentalRepository';
import { CreateRentalDTO } from '../../dtos/CreateRentalDTO';

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

  async execute(rentCarDTO: CreateRentalDTO): Promise<Rental> {
    // const {
    //   car_id,
    //   user_id: client_id,
    //   start_date,
    //   expected_return_date: end_date,
    // } = rentCarDTO;

    // if (isBefore(start_date, Date.now())) {
    //   throw new AppError(`you can't rent a car on a past date`);
    // }

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

    // const user = await this.userRepository.findById(client_id);

    // if (!user) {
    //   throw new AppError('no user was found for the given id');
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
