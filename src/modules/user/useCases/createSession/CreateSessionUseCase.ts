import { inject, injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import auth from '@config/auth';
import { AppError } from '@shared/errors/AppError';
import { User } from '@modules/user/models/User';
import { IHashProvider } from '../../providers/HashProvider/models/IHashProvider';
import { IUserRepository } from '../../repositories/IUserRepository';
import { CreateSessionDTO } from '../../dtos/CreateSessionDTO';

interface IResponse {
  token: string;
  user: User;
}

@injectable()
export class CreateSessionUseCase {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute(createSession: CreateSessionDTO): Promise<IResponse> {
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

    const { secret, expiresIn } = auth.jwt;

    const token = jwt.sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { token, user };
  }
}
