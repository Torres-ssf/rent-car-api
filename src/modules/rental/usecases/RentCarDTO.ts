import { IsDateString, IsUUID } from 'class-validator';

export class RentCarDTO {
  @IsUUID()
  car_id: string;

  @IsUUID()
  client_id: string;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;
}
