import { IsString, IsUUID, IsNotEmpty, IsArray } from 'class-validator';

export class UploadCarImageDTO {
  @IsUUID('4')
  car_id: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  images_names: string[];
}
