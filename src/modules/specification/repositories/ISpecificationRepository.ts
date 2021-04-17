import { CreateSpecificationDTO } from '../dtos/CreateSpecificationDTO';
import { Specification } from '../models/Specification';

export interface ISpecificationRepository {
  create({ name, description }: CreateSpecificationDTO): Promise<Specification>;
  list(): Promise<Specification[]>;
  findByName(name: string): Promise<Specification | undefined>;
  findByIds(specifications_ids: string[]): Promise<Specification[]>;
}
