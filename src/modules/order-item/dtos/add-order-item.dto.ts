import { ApiProperty } from '@nestjs/swagger';

export class AddOrderItemDto {
  @ApiProperty({ example: 1, description: 'ID of the order' })
  orderId: number;

  @ApiProperty({ example: 123, description: 'ID of the product' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  quantity: number;
}
