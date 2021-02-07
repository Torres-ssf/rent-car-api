import 'reflect-metadata';

import { FakeUserRepository } from '../../repositories/fakes/FakeUserRepository';
import { RegisterUserUseCase } from './RegisterUserUseCase';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;

  let userRepository: FakeUserRepository;

  const userParams = {
    name: 'Paul Airon',
    email: 'paul@email.com',
    password: '123456',
  };

  beforeEach(() => {
    userRepository = new FakeUserRepository();

    registerUserUseCase = new RegisterUserUseCase(userRepository);
  });

  it('should be able to register a new user', async () => {
    const createdUser = await registerUserUseCase.execute(userParams);

    expect(createdUser).toHaveProperty('id');
    expect(createdUser).toHaveProperty('name', createdUser.name);
    expect(createdUser).toHaveProperty('email', createdUser.email);
    expect(createdUser).toHaveProperty('password');
    expect(createdUser).toHaveProperty('image', null);
    expect(createdUser).toHaveProperty('admin', false);
    expect(createdUser).toHaveProperty('created_at');
    expect(createdUser).toHaveProperty('updated_at');
  });
});
