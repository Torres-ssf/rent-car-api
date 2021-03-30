import { Engine, Transmission } from '@modules/car/enums';
import { IsOptional } from 'class-validator';
import { CarDTO } from '../../dtos/CarDTO';

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
  engine?: Engine;

  @IsOptional()
  transmission?: Transmission;

  @IsOptional()
  passengers?: number;

  @IsOptional()
  daily_value?: number;
}
