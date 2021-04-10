import { container } from 'tsyringe';
import { IRentalRepository } from './repositories/IRentalRepository';
import { TypeormRentalRepository } from './repositories/implementations/TypeormRentalRepository';

container.registerSingleton<IRentalRepository>(
  'RentalRepository',
  TypeormRentalRepository,
);
