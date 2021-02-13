import { Transform } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';
import { parseISO } from 'date-fns';

export class RentCarDTO {
  @IsUUID()
  car_id: string;

  @IsUUID()
  client_id: string;

  @Transform(({ value }) => parseISO(value))
  @IsDate()
  start_date: Date;

  @Transform(({ value }) => parseISO(value))
  @IsDate()
  end_date: Date;
}
