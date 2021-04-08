import { ArrayMinSize, IsArray, IsUUID, ArrayUnique } from 'class-validator';

export class AddSpecificationToCarDTO {
  @IsUUID('4')
  car_id: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayUnique()
  specifications_ids: string[];
}
