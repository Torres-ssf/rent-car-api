import { container } from 'tsyringe';
import { appEnv } from '@config/environment';

import { ICarRepository } from './repositories/ICarRepository';
import { FakeCarRepository } from './repositories/fakes/FakeCarRepository';
import { TypeormCarRepository } from './repositories/implementations/TypeormCarRepository';

import { ICategoryRepository } from './repositories/ICategoryRepository';
import { TypeormCategoryRepository } from './repositories/implementations/TypeormCategoryRepository';
import { FakeCategoryRepository } from './repositories/fakes/FakeCategoryRepository';

container.registerSingleton<ICarRepository>(
  'CarRepository',
  appEnv === 'test' ? FakeCarRepository : TypeormCarRepository,
);

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  appEnv === 'test' ? FakeCategoryRepository : TypeormCategoryRepository,
);
