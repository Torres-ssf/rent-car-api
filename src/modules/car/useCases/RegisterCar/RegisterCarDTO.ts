import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  MaxLength,
  IsPositive,
  MinLength,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Transmission, Engine } from '../../models/enums';

export class RegisterCarDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @Transform(({ value }) => value.trim())
  model: string;

  @IsString()
  @MaxLength(80)
  @MinLength(2)
  @Transform(({ value }) => value.trim())
  brand: string;

  @IsPositive()
  @IsNumber()
  max_speed: number;

  @IsPositive()
  @IsNumber()
  horse_power: number;

  @IsPositive()
  @IsNumber()
  zero_to_one_hundred: number;

  @IsString()
  @IsEnum(Engine, { message: `engine must be one of ${Object.keys(Engine)}` })
  @Transform(({ value }) => value.trim().toUpperCase())
  engine: Engine;

  @IsString()
  @IsEnum(Transmission, {
    message: `engine must be one of ${Object.keys(Transmission)}`,
  })
  @Transform(({ value }) => value.trim().toUpperCase())
  transmission: Transmission;

  @Min(2)
  @Max(9)
  passengers: number;

  @IsPositive()
  @IsNumber()
  daily_value: number;
}
