import { container } from 'tsyringe';
import { ISpecificationRepository } from './repositories/ISpecificationRepository';
import { TypeormSpecificationRepository } from './repositories/implementations/TypeormSpecificationRepository';

container.registerSingleton<ISpecificationRepository>(
  'SpecificationRepository',
  TypeormSpecificationRepository,
);
