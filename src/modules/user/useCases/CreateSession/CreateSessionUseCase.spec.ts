import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';
import { v4 } from 'uuid';
import { User } from '../../model/User';
import { FakeHashProvider } from '../../providers/HashProvider/fakes/FakeHashProvider';
import { FakeUserRepository } from '../../repositories/fakes/FakeUserRepository';
import { CreateSessionUseCase } from './CreateSessionUseCase';

describe('CreateSessionUseCase', () => {
  let createSessionUseCase: CreateSessionUseCase;

  let fakeUsersRepository: FakeUserRepository;

  let fakeHashProvider: FakeHashProvider;

  const signinParams = {
    email: 'paul@email.com',
    password: '123456',
  };

  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    fakeHashProvider = new FakeHashProvider();

    createSessionUseCase = new CreateSessionUseCase(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should return an error if no user is found for the given password', async () => {
    await expect(
      createSessionUseCase.execute({
        email: signinParams.email,
        password: signinParams.password,
      }),
    ).rejects.toHaveProperty('message', 'wrong email/password combination');
  });
});
