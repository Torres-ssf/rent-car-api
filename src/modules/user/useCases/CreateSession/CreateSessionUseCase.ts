import { inject, injectable } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { IHashProvider } from '../../providers/HashProvider/models/IHashProvider';
import { IUserRepository } from '../../repositories/IUserRepository';
import { CreateSessionDTO } from './CreateSessionDTO';

@injectable()
export class CreateSessionUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute(createSession: CreateSessionDTO): Promise<void> {
    const { email, password } = createSession;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('wrong email/password combination', 403);
    }

    const passwordMatch = await this.hashProvider.compare({
      hashed: user.password,
      payload: password,
    });

    if (!passwordMatch) {
      throw new AppError('wrong email/password combination', 403);
    }
  }
}
