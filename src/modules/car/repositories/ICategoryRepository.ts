import { CreateCategoryDTO } from '../dtos/CreateCategoryDTO';
import { Category } from '../models/Category';

export interface ICategoryRepository {
  create({ name, description }: CreateCategoryDTO): Promise<Category>;
  findById(id: string): Promise<Category | undefined>;
  findByName(name: string): Promise<Category | undefined>;
  listCategories(): Promise<Category[]>;
}
