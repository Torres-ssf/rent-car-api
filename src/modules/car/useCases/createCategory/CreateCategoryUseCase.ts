import { CreateCategoryDTO } from '@modules/car/dtos/CreateCategoryDTO';
import { Category } from '@modules/car/models/Category';
import { ICategoryRepository } from '@modules/car/repositories/ICategoryRepository';
import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute({ name, description }: CreateCategoryDTO): Promise<Category> {
    const categoryExists = await this.categoryRepository.findByName(name);

    if (categoryExists) {
      throw new AppError(`Category with name ${name} already exists`);
    }

    const newCategory = await this.categoryRepository.create({
      name,
      description,
    });

    return newCategory;
  }
}
