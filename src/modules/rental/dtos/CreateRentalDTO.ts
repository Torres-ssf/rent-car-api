import { Transform } from 'class-transformer';
import { IsDate, IsUUID, IsEmpty } from 'class-validator';
import { parseISO } from 'date-fns';

export class CreateRentalDTO {
  @IsUUID('4')
  car_id: string;

  @IsUUID('4')
  user_id: string;

  @Transform(({ value }) => parseISO(value))
  @IsDate()
  start_date: Date;

  @Transform(({ value }) => parseISO(value))
  @IsDate()
  expected_return_date: Date;

  @IsEmpty()
  car_daily_value: number;

  @IsEmpty()
  car_daily_fine: number;

  @IsEmpty()
  estimated_total: number;
}
