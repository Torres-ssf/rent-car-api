import { Specification } from '@modules/specification/models/Specification';
import { ISpecificationRepository } from '@modules/specification/repositories/ISpecificationRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListSpecificationsUserCase {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository,
  ) {}

  async execute(): Promise<Specification[]> {
    return this.specificationRepository.list();
  }
}
