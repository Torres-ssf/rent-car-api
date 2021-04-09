import { appEnv } from '@config/environment';
import { container } from 'tsyringe';
import { ISpecificationRepository } from './repositories/ISpecificationRepository';
import { TypeormSpecificationRepository } from './repositories/implementations/TypeormSpecificationRepository';
import { FakeSpecificationRepository } from './repositories/fakes/FakeSpecificationRepository';

container.registerSingleton<ISpecificationRepository>(
  'SpecificationRepository',
  appEnv === 'test'
    ? FakeSpecificationRepository
    : TypeormSpecificationRepository,
);
