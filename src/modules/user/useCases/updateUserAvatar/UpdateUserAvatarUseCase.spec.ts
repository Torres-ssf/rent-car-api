import 'reflect-metadata';
import { v4 } from 'uuid';
import usersSeeds from '../../seeds/users.json';

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

  it('should update user avatar path if user already have an avatar registered', async () => {
    const userParams = usersSeeds[0];

    const newUser = await userRepository.create(userParams);

    newUser.avatar = 'myImage.jpeg';

    await userRepository.save(newUser);

    const newAvatar = 'my_new_avatar';

    await expect(
      updateUserAvatarUseCase.execute({
        user_id: newUser.id,
        user_avatar: newAvatar,
      }),
    ).resolves.toHaveProperty('avatar', newAvatar);

    await expect(userRepository.findById(newUser.id)).resolves.toHaveProperty(
      'avatar',
      newAvatar,
    );
  });

  it('should ensure user avatar is updated when user has no avatar', async () => {
    const userParams = usersSeeds[1];

    const newUser = await userRepository.create(userParams);

    const avatarPath = 'my-new-avatar.jpeg';

    await expect(
      updateUserAvatarUseCase.execute({
        user_id: newUser.id,
        user_avatar: avatarPath,
      }),
    ).resolves.toHaveProperty('avatar', avatarPath);

    await expect(userRepository.findById(newUser.id)).resolves.toHaveProperty(
      'avatar',
      avatarPath,
    );
  });
});
