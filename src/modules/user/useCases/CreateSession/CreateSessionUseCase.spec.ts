import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';
import { User } from '../../model/User';
import { FakeHashProvider } from '../../providers/HashProvider/fakes/FakeHashProvider';
import { FakeUserRepository } from '../../repositories/fakes/FakeUserRepository';
import { CreateSessionUseCase } from './CreateSessionUseCase';
import usersSeed from '../../seeds/usersParams.json';

describe('CreateSessionUseCase', () => {
  let createSessionUseCase: CreateSessionUseCase;

  let userRepository: FakeUserRepository;

  let hashProvider: FakeHashProvider;

  beforeEach(() => {
    userRepository = new FakeUserRepository();

    hashProvider = new FakeHashProvider();

    createSessionUseCase = new CreateSessionUseCase(
      userRepository,
      hashProvider,
    );
  });

  it('should return an error if no user is found for the given password', async () => {
    const user = usersSeed[0];

    await expect(
      createSessionUseCase.execute({
        email: user.email,
        password: user.password,
      }),
    ).rejects.toHaveProperty('message', 'wrong email/password combination');
  });

  it('should call compare method from the hash provider using the given password', async () => {
    const user = new User();

    const userParams = usersSeed[0];

    Object.assign(user, {
      ...userParams,
      password: await hashProvider.generateHash(userParams.password),
    });

    await userRepository.save(user);

    const spy = jest.spyOn(hashProvider, 'compare');

    await createSessionUseCase.execute({
      email: user.email,
      password: userParams.password,
    });

    expect(spy).toHaveBeenCalledWith({
      payload: userParams.password,
      hashed: user.password,
    });
  });
});
