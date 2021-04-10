import './providers';

import { container } from 'tsyringe';
import { IUserRepository } from './repositories/IUserRepository';
import { TypeormUserRepository } from './repositories/implementations/TypeormUserRepository';

container.registerSingleton<IUserRepository>(
  'UserRepository',
  TypeormUserRepository,
);
