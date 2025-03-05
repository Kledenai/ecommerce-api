import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ example: 123, description: 'ID of the product' })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ example: 5, description: 'New quantity of the product' })
  @IsInt()
  @Min(1)
  quantity: number;
}
