import { container } from 'tsyringe';
import { IUserRepository } from './repositories/IUserRepository';
import { FakeUserRepository } from './repositories/fakes/FakeUserRepository';

container.registerSingleton<IUserRepository>(
  'UserRepository',
  FakeUserRepository,
);
