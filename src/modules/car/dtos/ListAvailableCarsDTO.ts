import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListAvailableCarsDTO {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  model?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  brand?: string;

  @IsOptional()
  @IsUUID(4)
  category_id?: string;
}
