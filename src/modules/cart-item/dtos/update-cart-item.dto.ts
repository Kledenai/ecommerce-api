import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ example: 123, description: 'ID of the product' })
  productId: number;

  @ApiProperty({ example: 5, description: 'New quantity of the product' })
  quantity: number;
}
