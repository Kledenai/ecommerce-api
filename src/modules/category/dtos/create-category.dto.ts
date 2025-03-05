import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Category name' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
