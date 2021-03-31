import { CreateSpecificationDTO } from '@modules/car/dtos/CreateSpecificationDTO';
import { TypeormSpecification } from '@modules/car/entities/TypeormSpecification';
import { Specification } from '@modules/car/models/Specification';
import { getRepository, Repository } from 'typeorm';
import { ISpecificationRepository } from '../ISpecificationRepository';

export class TypeormSpecificationRepository
  implements ISpecificationRepository {
  private readonly specificationRepository: Repository<Specification>;

  constructor() {
    this.specificationRepository = getRepository(TypeormSpecification);
  }

  async create({
    name,
    description,
  }: CreateSpecificationDTO): Promise<Specification> {
    const newSpecification = this.specificationRepository.create({
      name,
      description,
      created_at: new Date(),
    });
    await this.specificationRepository.save(newSpecification);

    return newSpecification;
  }

  async findByName(name: string): Promise<Specification | undefined> {
    return this.specificationRepository.findOne({ where: { name } });
  }
}
