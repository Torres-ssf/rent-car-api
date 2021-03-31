import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { User } from '../models/User';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByDriverLicense(driver_license: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
}
