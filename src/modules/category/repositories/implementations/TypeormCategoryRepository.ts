import { CreateCategoryDTO } from '@modules/category/dtos/CreateCategoryDTO';
import { TypeormCategory } from '@modules/category/entities/TypeormCategory';
import { Category } from '@modules/category/models/Category';
import { getRepository, Repository } from 'typeorm';
import { ICategoryRepository } from '../ICategoryRepository';

export class TypeormCategoryRepository implements ICategoryRepository {
  private readonly categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = getRepository(TypeormCategory);
  }

  async create({ name, description }: CreateCategoryDTO): Promise<Category> {
    const newCategory = this.categoryRepository.create({
      name,
      description,
    });

    await this.categoryRepository.save(newCategory);

    return newCategory;
  }

  async findById(id: string): Promise<Category | undefined> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.categoryRepository.findOne({ where: { name } });
  }

  async listCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
}
