import { container } from 'tsyringe';
import { ICarRepository } from './repositories/ICarRepository';
import { FakeCarRepository } from './repositories/fakes/FakeCarRepository';

import { ICategoryRepository } from './repositories/ICategoryRepository';
import { FakeCategoryRepository } from './repositories/fakes/FakeCategoryRepository';

container.registerSingleton<ICarRepository>('CarRepository', FakeCarRepository);

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  FakeCategoryRepository,
);
