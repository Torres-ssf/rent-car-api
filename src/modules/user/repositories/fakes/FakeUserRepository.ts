import { CreateUserDTO } from '@modules/user/dtos/CreateUserDTO';
import { User } from '../../models/User';
import { IUserRepository } from '../IUserRepository';

export class FakeUserRepository implements IUserRepository {
  private readonly users: User[] = [];

  async create({
    name,
    email,
    driver_license,
    password,
  }: CreateUserDTO): Promise<User> {
    const newUser = new User();

    const dateNow = new Date();

    Object.assign(newUser, {
      name,
      email,
      password,
      avatar: null,
      admin: false,
      driver_license,
      created_at: dateNow,
      updated_at: dateNow,
    });

    this.users.push(newUser);

    return newUser;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findByDriverLicense(driver_license: string): Promise<User | undefined> {
    return this.users.find(user => user.driver_license === driver_license);
  }

  async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(eachUser => eachUser.id === user.id);

    if (userIndex < 0) {
      this.users.push(user);
    } else {
      this.users[userIndex] = user;
    }

    return user;
  }
}
