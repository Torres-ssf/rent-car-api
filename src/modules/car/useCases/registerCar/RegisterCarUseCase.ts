import { inject, injectable } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { ICategoryRepository } from '@modules/category/repositories/ICategoryRepository';
import { Car } from '../../models/Car';
import { ICarRepository } from '../../repositories/ICarRepository';
import { RegisterCarDTO } from '../../dtos/RegisterCarDTO';

@injectable()
export class RegisterCarUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  async execute(registerCarDTO: RegisterCarDTO): Promise<Car> {
    const {
      model,
      brand,
      license_plate,
      horse_power,
      max_speed,
      zero_to_one_hundred,
      daily_value,
      fine_amount,
      category_id,
    } = registerCarDTO;

    const licensePlateExists = await this.carRepository.findByLicensePlate(
      license_plate,
    );

    if (licensePlateExists) {
      throw new AppError('License plate already in use');
    }

    const categoryExists = await this.categoryRepository.findById(category_id);

    if (!categoryExists) {
      throw new AppError('Category does not exists');
    }

    return this.carRepository.create({
      model,
      brand,
      license_plate,
      horse_power,
      max_speed,
      zero_to_one_hundred,
      daily_value,
      fine_amount,
      category_id,
    });
  }
}
