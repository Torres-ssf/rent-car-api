import { CreateSpecificationDTO } from '../dtos/CreateSpecificationDTO';
import { Specification } from '../models/Specification';

export interface ISpecificationRepository {
  create({ name, description }: CreateSpecificationDTO): Promise<Specification>;
  findByName(name: string): Promise<Specification | undefined>;
}
