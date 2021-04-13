import { CreateSpecificationDTO } from '@modules/specification/dtos/CreateSpecificationDTO';
import { Specification } from '@modules/specification/models/Specification';
import { ISpecificationRepository } from '@modules/specification/repositories/ISpecificationRepository';
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
      throw new AppError(`Specification with name ${name} already exists`);
    }

    const newSpecification = await this.specificationRepository.create({
      name,
      description,
    });

    return newSpecification;
  }
}
