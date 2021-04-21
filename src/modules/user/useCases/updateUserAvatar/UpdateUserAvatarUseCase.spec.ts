import 'reflect-metadata';
import { v4 } from 'uuid';

import { FakeUserRepository } from '../../repositories/fakes/FakeUserRepository';
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

describe('UpdateUserAvatarUseCase', () => {
  let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

  let userRepository: FakeUserRepository;

  beforeEach(() => {
    userRepository = new FakeUserRepository();

    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(userRepository);
  });

  it('should return an error if no user is found for the given email', async () => {
    await expect(
      updateUserAvatarUseCase.execute({
        user_id: v4(),
        user_avatar: 'my_avatar.jpge',
      }),
    ).rejects.toHaveProperty('message', 'No user was found for the given id');
  });
});
