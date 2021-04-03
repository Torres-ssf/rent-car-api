import 'reflect-metadata';

import { FakeUserRepository } from '../../repositories/fakes/FakeUserRepository';
import { RegisterUserUseCase } from './RegisterUserUseCase';
import { FakeHashProvider } from '../../providers/HashProvider/fakes/FakeHashProvider';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;

  let userRepository: FakeUserRepository;

  let hashProvoider: FakeHashProvider;

  const userParams = {
    name: 'Paul Airon',
    email: 'paul@email.com',
    password: '123456',
    driver_license: '123442545234',
  };

  beforeEach(() => {
    userRepository = new FakeUserRepository();

    hashProvoider = new FakeHashProvider();

    registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      hashProvoider,
    );
  });

  it('should be able to register a new user', async () => {
    const createdUser = await registerUserUseCase.execute(userParams);

    expect(createdUser).toHaveProperty('id');
    expect(createdUser).toHaveProperty('name', createdUser.name);
    expect(createdUser).toHaveProperty('email', createdUser.email);
    expect(createdUser).toHaveProperty('password');
    expect(createdUser).toHaveProperty('avatar', null);
    expect(createdUser).toHaveProperty('admin', false);
    expect(createdUser).toHaveProperty('created_at');
    expect(createdUser).toHaveProperty('updated_at');
  });

  it('should be able to verify if given email is already in use', async () => {
    await registerUserUseCase.execute(userParams);

    await expect(
      registerUserUseCase.execute({
        name: 'Paul',
        email: userParams.email,
        password: 'a.gdfssSfsa9',
        driver_license: '123442545234',
      }),
    ).rejects.toHaveProperty('message', 'Email already taken');
  });

  it('should hash password before assing to user object', async () => {
    const spy = jest.spyOn(hashProvoider, 'generateHash');

    const res = await registerUserUseCase.execute({
      name: 'Paul',
      email: userParams.email,
      password: 'unhashedPass10',
      driver_license: '123442545234',
    });

    expect(spy).toHaveBeenCalledWith('unhashedPass10');
    expect(res.password !== userParams.password).toBeTruthy();
  });
});
