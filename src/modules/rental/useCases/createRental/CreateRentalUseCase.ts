import { ICarRepository } from '@modules/car/repositories/ICarRepository';
import { AppError } from '@shared/errors/AppError';
import { IUserRepository } from '@modules/user/repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';
import { ClientSideCreateRentalDTO } from '@modules/rental/dtos/ClientSideCreateRentalDTO';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
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
    @inject('DateProvider')
    private dateProvider: IDateProvider,
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
      throw new AppError('Car is not available');
    }

    if (this.dateProvider.isBefore(start_date, Date.now())) {
      throw new AppError('Start date cannot be a past date');
    }

    if (!this.dateProvider.isSameDay(start_date, Date.now())) {
      throw new AppError('Start date cannot be a future date');
    }

    if (this.dateProvider.isBefore(expected_return_date, Date.now())) {
      throw new AppError('Return date cannot be a past date');
    }

    if (this.dateProvider.isSameDay(expected_return_date, Date.now())) {
      throw new AppError(
        'Return date cannot be at the same day as the start date',
      );
    }

    const estimatedRentPeriod = this.dateProvider.differenceInDays(
      expected_return_date,
      start_date,
    );

    const rental = await this.rentalRepository.create({
      user_id,
      car_id,
      start_date,
      expected_return_date,
      car_daily_value: Number(carExists.daily_value),
      car_daily_fine: Number(carExists.fine_amount),
      estimated_total: estimatedRentPeriod * carExists.daily_value,
    });

    await this.carRepository.updateCarAvailability(car_id, false);

    return rental;
  }
}
