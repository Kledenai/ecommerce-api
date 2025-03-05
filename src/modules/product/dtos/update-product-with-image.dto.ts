import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UpdateProductDto } from './update-product.dto';

export class UpdateProductWithImageDto extends PartialType(UpdateProductDto) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}
