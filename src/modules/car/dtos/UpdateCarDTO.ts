import { IsOptional } from 'class-validator';
import { CarDTO } from './CarDTO';

export class UpdateCarDTO extends CarDTO {
  @IsOptional()
  model?: string;

  @IsOptional()
  brand?: string;

  @IsOptional()
  max_speed?: number;

  @IsOptional()
  horse_power?: number;

  @IsOptional()
  zero_to_one_hundred?: number;

  @IsOptional()
  daily_value?: number;

  @IsOptional()
  license_plate?: string;

  @IsOptional()
  fine_amount?: number;

  @IsOptional()
  category_id?: string;
}
