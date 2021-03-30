import { TypeormUser } from '@modules/user/entities/TypeormUser';
import { User } from '@modules/user/models/User';
import { getRepository, Repository } from 'typeorm';
import { IUserRepository } from '../IUserRepository';

export class TypeormUserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(TypeormUser);
  }

  findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(id);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}
