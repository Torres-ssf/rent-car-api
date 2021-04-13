import { CreateSpecificationDTO } from '@modules/specification/dtos/CreateSpecificationDTO';
import { Specification } from '@modules/specification/models/Specification';
import { ISpecificationRepository } from '../ISpecificationRepository';

export class FakeSpecificationRepository implements ISpecificationRepository {
  private readonly specifications: Specification[] = [];

  constructor() {
    this.specifications = [];
  }

  async create({
    name,
    description,
  }: CreateSpecificationDTO): Promise<Specification> {
    const newSpecification = new Specification();

    Object.assign(newSpecification, {
      name,
      description,
      created_at: new Date(),
    });

    this.specifications.push(newSpecification);

    return newSpecification;
  }

  async findByName(name: string): Promise<Specification | undefined> {
    return this.specifications.find(spec => spec.name === name);
  }

  async findByIds(specifications_ids: string[]): Promise<Specification[]> {
    return this.specifications.filter(spec =>
      specifications_ids.includes(spec.id),
    );
  }

  async list(): Promise<Specification[]> {
    return this.specifications;
  }
}
