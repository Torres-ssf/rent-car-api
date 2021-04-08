import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class AddSpecificationToCarDTO {
  @IsUUID()
  car_id: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  specifications_ids: string[];
}
