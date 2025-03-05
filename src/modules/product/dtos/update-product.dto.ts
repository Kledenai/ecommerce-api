import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 'New Laptop Name', description: 'Updated product name', required: false })
  name?: string;

  @ApiProperty({ example: 1099.99, description: 'Updated product price', required: false })
  price?: number;

  @ApiProperty({ example: 'Updated description', description: 'Updated product description', required: false })
  description?: string;

  @ApiProperty({ example: 2, description: 'Updated category ID', required: false })
  categoryId?: number;

  @ApiProperty({ example: 'https://example.com/laptop.jpg', description: 'Updated image URL', required: false })
  imageUrl?: string;
}
