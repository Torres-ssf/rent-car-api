import {
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsPositive()
  @IsNumber()
  abstract daily_value?: number;

  @IsString()
  abstract license_plate?: string;

  @IsPositive()
  @IsNumber()
  abstract fine_amount?: number;

  @IsUUID()
  abstract category_id?: string;
}
