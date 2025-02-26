import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop', description: 'Name of the product' })
  name: string;

  @ApiProperty({ example: 999.99, description: 'Price of the product' })
  price: number;

  @ApiProperty({ example: 'A high-performance laptop', description: 'Product description', required: false })
  description?: string;

  @ApiProperty({ example: 'https://example.com/laptop.jpg', description: 'Image URL of the product' })
  imageUrl: string;

  @ApiProperty({ example: 1, description: 'ID of the product category' })
  categoryId: number;
}
