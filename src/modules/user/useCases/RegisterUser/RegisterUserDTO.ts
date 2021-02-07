import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @MinLength(8)
  @MaxLength(20)
  @Transform(({ value }) => value.trim())
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password should have at least one number, one symbol, one lower case, and one upper case',
  })
  password: string;
}
