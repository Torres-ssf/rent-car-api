import { Category } from '@modules/category/models/Category';
import { ICategoryRepository } from '@modules/category/repositories/ICategoryRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListCategoriesUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.listCategories();
  }
}
