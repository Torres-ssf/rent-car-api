import { User } from '@modules/user/models/User';
import { IUserRepository } from '@modules/user/repositories/IUserRepository';
import { AppError } from '@shared/errors/AppError';
import { deleteMultipleFiles } from '@shared/utils/deleteMultipleFiles';
import { inject, injectable } from 'tsyringe';

interface IParams {
  user_id: string;
  user_avatar: string;
}

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {
    this.userRepository = userRepository;
  }

  async execute({ user_id, user_avatar }: IParams): Promise<User> {
    const userExists = await this.userRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('No user was found for the given id', 401);
    }

    if (userExists.avatar) {
      await deleteMultipleFiles([`./tmp/avatar/${userExists.avatar}`]);
    }

    userExists.avatar = user_avatar;

    return this.userRepository.save(userExists);
  }
}
