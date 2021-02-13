import { container } from 'tsyringe';
import { IRentalRepository } from './repositories/IRentalRepository';
import { FakeRentalRepository } from './repositories/fakes/FakeRentalRepository';

container.registerSingleton<IRentalRepository>(
  'RentalRepository',
  FakeRentalRepository,
);
