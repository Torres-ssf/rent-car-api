import { Category } from '@modules/car/models/Category';
import { ICategoryRepository } from '@modules/car/repositories/ICategoryRepository';
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
