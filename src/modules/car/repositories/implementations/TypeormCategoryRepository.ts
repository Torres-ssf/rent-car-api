import { CreateCategoryDTO } from '@modules/car/dtos/CreateCategoryDTO';
import { TypeormCategory } from '@modules/car/entities/TypeormCategory';
import { Category } from '@modules/car/models/Category';
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
      created_at: new Date(),
    });

    await this.categoryRepository.save(newCategory);

    return newCategory;
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.categoryRepository.findOne({ where: { name } });
  }

  async listCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
}
