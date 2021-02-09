import { Transform } from 'class-transformer';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateSessionDTO {
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @MinLength(8)
  @MaxLength(20)
  @Transform(({ value }) => value.trim())
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, {
    message:
      'Password should have at least one number, one lower letter, and one upper letter',
  })
  password: string;
}
