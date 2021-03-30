import { CreateSpecificationDTO } from '@modules/car/dtos/CreateSpecificationDTO';
import { Specification } from '@modules/car/models/Specification';
import { ISpecificationRepository } from '@modules/car/repositories/ISpecificationRepository';
import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateSpecificationUseCase {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository,
  ) {}

  async execute({
    name,
    description,
  }: CreateSpecificationDTO): Promise<Specification> {
    const specificationExists = await this.specificationRepository.findByName(
      name,
    );

    if (specificationExists) {
      throw new AppError(`Specification already exists`);
    }

    const newSpecification = await this.specificationRepository.create({
      name,
      description,
    });

    return newSpecification;
  }
}
