import { inject, injectable } from 'tsyringe';
import { Car } from '@modules/car/models/Car';
import { ICarRepository } from '@modules/car/repositories/ICarRepository';
import { ListAvailableCarsDTO } from '@modules/car/dtos/ListAvailableCarsDTO';
import { ICategoryRepository } from '@modules/category/repositories/ICategoryRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ListAvailableCarsUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute(listAvailableCarsDTO: ListAvailableCarsDTO): Promise<Car[]> {
    const { category_id } = listAvailableCarsDTO;

    if (category_id) {
      const categoryExists = await this.categoryRepository.findById(
        category_id,
      );

      if (!categoryExists) {
        throw new AppError('Category does not exists');
      }
    }

    return this.carRepository.listAvailableCars(listAvailableCarsDTO);
  }
}
