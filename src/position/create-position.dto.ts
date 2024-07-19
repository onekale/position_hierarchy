//import decorators from the class-validator to validate the data types of the properties in the class 
import { IsString, IsOptional, IsInt } from 'class-validator';

//used to transfer data for creating a new position
export class CreatePositionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
