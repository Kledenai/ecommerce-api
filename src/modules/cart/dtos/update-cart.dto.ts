import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ example: 123, description: 'ID of the product to update' })
  productId: number;

  @ApiProperty({ example: 2, description: 'New quantity of the product in the cart' })
  quantity: number;
}
