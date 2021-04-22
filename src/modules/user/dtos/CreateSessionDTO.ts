import { Transform } from 'class-transformer';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateSessionDTO {
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})\S*$/, {
    message:
      'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
  })
  password: string;
}
