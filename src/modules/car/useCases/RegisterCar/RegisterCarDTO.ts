import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  MaxLength,
  IsPositive,
  MinLength,
} from 'class-validator';

export class RegisterCarDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @MaxLength(80)
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  brand: string;

  @IsPositive()
  @IsNumber()
  daily_value: number;
}
