import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListAvailableCarsDTO {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }) => value.trim())
  model?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }) => value.trim())
  brand?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;
}
