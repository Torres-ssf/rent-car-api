import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { User } from '../../models/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute(registerUserDTO: CreateUserDTO): Promise<User> {
    const { name, email, password, driver_license } = registerUserDTO;

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('Email already taken');
    }

    const licenseInUse = await this.userRepository.findByDriverLicense(
      driver_license,
    );

    if (licenseInUse) {
      throw new AppError('Driver license already being used by another user');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    return this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      driver_license,
    });
  }
}
