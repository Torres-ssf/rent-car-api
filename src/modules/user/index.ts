import './providers';

import { container } from 'tsyringe';
import { IUserRepository } from './repositories/IUserRepository';
import { TypeormUserRepository } from './repositories/typeorm/TypeormUserRepository';

container.registerSingleton<IUserRepository>(
  'UserRepository',
  TypeormUserRepository,
);
