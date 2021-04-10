import { container } from 'tsyringe';

import { ICarImageRepository } from './repositories/ICarImageRepository';
import { TypeormCarImageRepository } from './repositories/implementations/TypeormCarImageRepository';

container.registerSingleton<ICarImageRepository>(
  'CarImageRepository',
  TypeormCarImageRepository,
);
