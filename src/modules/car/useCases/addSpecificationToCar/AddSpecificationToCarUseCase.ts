import { AddSpecificationToCarDTO } from '@modules/car/dtos/AddSpecificationToCarDTO';
import { Car } from '@modules/car/models/Car';
import { ICarRepository } from '@modules/car/repositories/ICarRepository';
import { ISpecificationRepository } from '@modules/specification/repositories/ISpecificationRepository';
import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AddSpecificationToCarUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository,
  ) {}

  async execute(
    addSpecificationToCarDTO: AddSpecificationToCarDTO,
  ): Promise<Car> {
    const { car_id, specifications_ids } = addSpecificationToCarDTO;

    const carExists = await this.carRepository.findById(car_id);

    if (!carExists) {
      throw new AppError('No car found for the given car id');
    }

    const specifications = await this.specificationRepository.findByIds(
      specifications_ids,
    );

    if (specifications.length === 0) {
      throw new AppError('No specifications were found for the given ids');
    }

    if (specifications.length !== specifications_ids.length) {
      throw new AppError(
        'One or more specifications were not found for the given ids',
      );
    }

    return new Car();
  }
}
