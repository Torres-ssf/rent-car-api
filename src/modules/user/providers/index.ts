import { container } from 'tsyringe';

import { appEnv } from '@config/environment';
import { IHashProvider } from './HashProvider/models/IHashProvider';
import { FakeHashProvider } from './HashProvider/fakes/FakeHashProvider';
import { BcryptHashProvider } from './HashProvider/implementations/BcryptHashProvider';

container.registerSingleton<IHashProvider>(
  'HashProvider',
  appEnv === 'test' ? FakeHashProvider : BcryptHashProvider,
);
