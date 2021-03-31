import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  IsNumberString,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})\S*$/, {
    message:
      'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
  })
  password: string;

  @IsNotEmpty()
  @IsNumberString()
  driver_license: string;
}
