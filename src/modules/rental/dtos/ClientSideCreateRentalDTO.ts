import { Transform } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';
import { parseISO } from 'date-fns';

export class ClientSideCreateRentalDTO {
  @IsUUID('4')
  user_id: string;

  @IsUUID('4')
  car_id: string;

  @Transform(({ value }) => parseISO(value))
  @IsDate()
  start_date: Date;

  @Transform(({ value }) => parseISO(value))
  @IsDate()
  expected_return_date: Date;
}
