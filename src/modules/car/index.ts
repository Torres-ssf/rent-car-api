import { container } from 'tsyringe';
import { appEnv } from '@config/environment';

import { ICarRepository } from './repositories/ICarRepository';
import { FakeCarRepository } from './repositories/fakes/FakeCarRepository';
import { TypeormCarRepository } from './repositories/implementations/TypeormCarRepository';

import { ICategoryRepository } from './repositories/ICategoryRepository';
import { TypeormCategoryRepository } from './repositories/implementations/TypeormCategoryRepository';
import { FakeCategoryRepository } from './repositories/fakes/FakeCategoryRepository';

import { ISpecificationRepository } from './repositories/ISpecificationRepository';
import { TypeormSpecificationRepository } from './repositories/implementations/TypeormSpecificationRepository';
import { FakeSpecificationRepository } from './repositories/fakes/FakeSpecificationRepository';

container.registerSingleton<ICarRepository>(
  'CarRepository',
  appEnv === 'test' ? FakeCarRepository : TypeormCarRepository,
);

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  appEnv === 'test' ? FakeCategoryRepository : TypeormCategoryRepository,
);

container.registerSingleton<ISpecificationRepository>(
  'SpecificationRepository',
  appEnv === 'test'
    ? FakeSpecificationRepository
    : TypeormSpecificationRepository,
);
