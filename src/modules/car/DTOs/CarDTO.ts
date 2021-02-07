import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Engine, Transmission } from '../models/enums';

export abstract class CarDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @Transform(({ value }) => value.trim())
  abstract model?: string;

  @IsString()
  @MaxLength(80)
  @MinLength(2)
  @Transform(({ value }) => value.trim())
  abstract brand?: string;

  @IsPositive()
  @IsNumber()
  abstract max_speed?: number;

  @IsPositive()
  @IsNumber()
  abstract horse_power?: number;

  @IsPositive()
  @IsNumber()
  abstract zero_to_one_hundred?: number;

  @IsString()
  @IsEnum(Engine, { message: `engine must be one of ${Object.keys(Engine)}` })
  @Transform(({ value }) => value.trim().toUpperCase())
  abstract engine?: Engine;

  @IsString()
  @IsEnum(Transmission, {
    message: `engine must be one of ${Object.keys(Transmission)}`,
  })
  @Transform(({ value }) => value.trim().toUpperCase())
  abstract transmission?: Transmission;

  @Min(2)
  @Max(9)
  abstract passengers?: number;

  @IsPositive()
  @IsNumber()
  abstract daily_value?: number;
}
