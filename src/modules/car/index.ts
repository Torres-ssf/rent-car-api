import { container } from 'tsyringe';

import { ICarRepository } from './repositories/ICarRepository';
import { TypeormCarRepository } from './repositories/implementations/TypeormCarRepository';

container.registerSingleton<ICarRepository>(
  'CarRepository',
  TypeormCarRepository,
);
