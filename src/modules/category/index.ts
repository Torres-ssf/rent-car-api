import { container } from 'tsyringe';
import { ICategoryRepository } from './repositories/ICategoryRepository';
import { TypeormCategoryRepository } from './repositories/implementations/TypeormCategoryRepository';

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  TypeormCategoryRepository,
);
