import { container } from 'tsyringe';
import { appEnv } from '@config/environment';

import { ICarRepository } from './repositories/ICarRepository';
import { FakeCarRepository } from './repositories/fakes/FakeCarRepository';

import { ICategoryRepository } from './repositories/ICategoryRepository';
import { TypeormCategoryRepository } from './repositories/implementations/TypeormCategoryRepository';
import { FakeCategoryRepository } from './repositories/fakes/FakeCategoryRepository';

import { ISpecificationRepository } from './repositories/ISpecificationRepository';
import { FakeSpecificationRepository } from './repositories/fakes/FakeSpecificationRepository';

container.registerSingleton<ICarRepository>('CarRepository', FakeCarRepository);

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  appEnv === 'test' ? FakeCategoryRepository : TypeormCategoryRepository,
);

container.registerSingleton<ISpecificationRepository>(
  'SpecificationRepository',
  FakeSpecificationRepository,
);
