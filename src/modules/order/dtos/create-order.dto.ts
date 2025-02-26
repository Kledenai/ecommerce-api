import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 123, description: 'ID of the product' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID of the user placing the order' })
  userId: number;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of items in the order',
  })
  items: OrderItemDto[];
}
