import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({ example: 1, description: 'ID of the cart' })
  cartId: number;

  @ApiProperty({ example: 123, description: 'ID of the product' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  quantity: number;
}
