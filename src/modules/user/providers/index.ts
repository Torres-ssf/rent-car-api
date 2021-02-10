import { container } from 'tsyringe';

import { IHashProvider } from './HashProvider/models/IHashProvider';
import { FakeHashProvider } from './HashProvider/fakes/FakeHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', FakeHashProvider);
