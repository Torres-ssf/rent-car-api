import { container } from 'tsyringe';

import { appEnv } from '@config/environment';
import { ICarImageRepository } from './repositories/ICarImageRepository';
import { TypeormCarImageRepository } from './repositories/implementations/TypeormCarImageRepository';
import { FakeCarImageRepository } from './repositories/fakes/FakeCarImageRepository';

container.registerSingleton<ICarImageRepository>(
  'CarImageRepository',
  appEnv === 'test' ? FakeCarImageRepository : TypeormCarImageRepository,
);
