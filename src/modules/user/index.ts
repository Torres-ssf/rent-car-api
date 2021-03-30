import './providers';
import { appEnv } from '@config/environment';

import { container } from 'tsyringe';
import { IUserRepository } from './repositories/IUserRepository';
import { TypeormUserRepository } from './repositories/implementations/TypeormUserRepository';
import { FakeUserRepository } from './repositories/fakes/FakeUserRepository';

container.registerSingleton<IUserRepository>(
  'UserRepository',
  appEnv === 'test' ? FakeUserRepository : TypeormUserRepository,
);
