import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({ example: 'New Electronics', description: 'Updated category name', required: false })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name?: string;
}
