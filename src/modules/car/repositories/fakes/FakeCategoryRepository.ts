import { CreateCategoryDTO } from '@modules/car/dtos/CreateCategoryDTO';
import { Category } from '@modules/car/models/Category';
import { ICategoryRepository } from '../ICategoryRepository';

export class FakeCategoryRepository implements ICategoryRepository {
  private readonly categories: Category[] = [];

  async create({ name, description }: CreateCategoryDTO): Promise<Category> {
    const newCategory = new Category();

    Object.assign(newCategory, { name, description, created_at: new Date() });

    this.categories.push(newCategory);

    return newCategory;
  }

  async findById(id: string): Promise<Category | undefined> {
    return this.categories.find(category => category.id === id);
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.categories.find(eachCategory => eachCategory.name === name);
  }

  async listCategories(): Promise<Category[]> {
    return this.categories;
  }
}
