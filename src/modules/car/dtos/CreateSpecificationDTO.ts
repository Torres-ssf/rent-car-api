import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSpecificationDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
