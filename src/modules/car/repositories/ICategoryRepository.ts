import { CreateCategoryDTO } from '../dtos/CreateCategoryDTO';
import { Category } from '../models/Category';

export interface ICategoryRepository {
  create({ name, description }: CreateCategoryDTO): Promise<Category>;
  findByName(name: string): Promise<Category | undefined>;
  listCategories(): Promise<Category[]>;
}
