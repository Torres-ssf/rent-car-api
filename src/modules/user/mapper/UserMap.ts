import { classToClass } from 'class-transformer';
import { UserResponseDTO } from '../dtos/ResponseUserDTO';
import { User } from '../models/User';

export class UserMap {
  static toUserResponseDTO(user: User): UserResponseDTO {
    const { id, name, email, driver_license, avatar } = classToClass(user);

    return {
      id,
      name,
      email,
      driver_license,
      avatar,
    };
  }
}
