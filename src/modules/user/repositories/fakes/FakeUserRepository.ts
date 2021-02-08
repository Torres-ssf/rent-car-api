import { User } from '../../model/User';
import { IUserRepository } from '../IUserRepository';

export class FakeUserRepository implements IUserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async save(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }
}
