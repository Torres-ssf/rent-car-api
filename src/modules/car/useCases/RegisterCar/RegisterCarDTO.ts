import { IsNumber, IsString, MaxLength } from 'class-validator';

export class RegisterCarDTO {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsString()
  @MaxLength(80)
  brand: string;

  @IsNumber()
  dailyValue: number;
}
