import { container } from 'tsyringe';

import { IHashProvider } from './models/IHashProvider';
import { BcryptHashProvider } from './implementations/BcryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
