import { CreateUserDTO } from '@modules/user/dtos/CreateUserDTO';
import { TypeormUser } from '@modules/user/entities/TypeormUser';
import { User } from '@modules/user/models/User';
import { getRepository, Repository } from 'typeorm';
import { IUserRepository } from '../IUserRepository';

export class TypeormUserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(TypeormUser);
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = this.ormRepository.create({
      ...createUserDTO,
      image: null,
      admin: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await this.ormRepository.save(newUser);

    return newUser;
  }

  findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(id);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ email });
  }

  findByDriverLicense(driver_license: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ driver_license });
  }

  save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}
