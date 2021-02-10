import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { v4 } from 'uuid';
import { IHashProvider } from '@modules/user/providers/HashProvider/models/IHashProvider';
import { User } from '../../model/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { RegisterUserDTO } from './RegisterUserDTO';

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute(registerUserDTO: RegisterUserDTO): Promise<User> {
    const { name, email, password } = registerUserDTO;

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('Email already taken');
    }

    const hashedPassword = this.hashProvider.generateHash(password);

    const user = new User();

    const now = new Date();

    Object.assign(user, {
      id: v4(),
      name,
      email,
      password: hashedPassword,
      image: null,
      admin: false,
      created_at: now,
      updated_at: now,
    });

    return this.userRepository.save(user);
  }
}
