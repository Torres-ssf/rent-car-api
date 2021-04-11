import { container } from 'tsyringe';

import { ICarRepository } from './repositories/ICarRepository';
import { TypeormCarRepository } from './repositories/implementations/TypeormCarRepository';

import { ICategoryRepository } from './repositories/ICategoryRepository';
import { TypeormCategoryRepository } from './repositories/implementations/TypeormCategoryRepository';

container.registerSingleton<ICarRepository>(
  'CarRepository',
  TypeormCarRepository,
);

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  TypeormCategoryRepository,
);
