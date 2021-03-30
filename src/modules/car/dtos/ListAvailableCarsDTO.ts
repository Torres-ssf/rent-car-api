import {
  IsDate,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Engine, Transmission } from '@modules/car/enums';
import { Transform } from 'class-transformer';
import { parseISO } from 'date-fns';

export class ListAvailableCarsDTO {
  @Transform(({ value }) => parseISO(value))
  @IsDate()
  start_date: Date;

  @Transform(({ value }) => parseISO(value))
  @IsDate()
  end_date: Date;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  @MinLength(2)
  model?: string | undefined;

  @IsOptional()
  @IsString()
  @IsEnum(Engine, { message: `engine must be one of ${Object.keys(Engine)}` })
  @Transform(({ value }) => value.toUpperCase())
  engine?: Engine | undefined;

  @IsOptional()
  @IsString()
  @IsEnum(Transmission, {
    message: `engine must be one of ${Object.keys(Transmission)}`,
  })
  @Transform(({ value }) => value.toUpperCase())
  transmission?: Transmission | undefined;

  @IsOptional()
  @IsNumberString()
  daily_value?: number | undefined;
}
