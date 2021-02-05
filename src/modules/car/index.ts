import { container } from 'tsyringe';
import { ICarRepository } from './repositories/ICarRepository';
import { FakeCarRepository } from './repositories/fakes/FakeCarRepository';

container.registerSingleton<ICarRepository>('CarRepository', FakeCarRepository);
