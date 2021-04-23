import { Transform } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';
import { parseISO } from 'date-fns';

export class ClientSideCreateRentalDTO {
  @IsUUID('4')
  user_id: string;

  @IsUUID('4')
  car_id: string;

  @IsDate({ message: 'start_date must be a date string' })
  @Transform(({ value }) => parseISO(value))
  start_date: Date;

  @IsDate({ message: 'expected_return_date must be a date string' })
  @Transform(({ value }) => parseISO(value))
  expected_return_date: Date;
}
