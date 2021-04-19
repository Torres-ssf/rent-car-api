import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateCarDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  model?: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  brand?: string;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  max_speed?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  horse_power?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  zero_to_one_hundred?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  daily_value?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  fine_amount?: number;

  @IsUUID('4')
  @IsOptional()
  category_id?: string;
}
