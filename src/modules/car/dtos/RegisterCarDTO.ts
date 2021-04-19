import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class RegisterCarDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  model: string;

  @IsString()
  @IsNotEmpty()
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

  @IsPositive()
  @IsNumber()
  daily_value: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  license_plate: string;

  @IsPositive()
  @IsNumber()
  fine_amount: number;

  @IsUUID('4')
  category_id: string;
}
