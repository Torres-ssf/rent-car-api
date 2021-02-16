import { inject, injectable } from 'tsyringe';
import { Car } from '@modules/car/models/Car';
import { isBefore, isSameDay } from 'date-fns';
import { AppError } from '@shared/errors/AppError';
import { ICarRepository } from '@modules/car/repositories/ICarRepository';
import { ListAvailableCarsDTO } from '../../dtos/ListAvailableCarsDTO';

@injectable()
export class ListAvailableCarsUseCase {
  constructor(
    @inject('RentalRepository')
    private carRepository: ICarRepository,
  ) {}

  async execute(listCarAvailabilityDTO: ListAvailableCarsDTO): Promise<Car[]> {
    const { start_date, end_date } = listCarAvailabilityDTO;

    if (isBefore(start_date, Date.now())) {
      throw new AppError("start date can't be a past date");
    }

    return [];
  }
}
