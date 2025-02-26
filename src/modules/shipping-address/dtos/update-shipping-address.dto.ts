import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateShippingAddressDto } from './create-shipping-address.dto';

export class UpdateShippingAddressDto extends PartialType(CreateShippingAddressDto) {
  @ApiProperty({ example: 'New York', description: 'Updated city', required: false })
  city?: string;

  @ApiProperty({ example: 'NY', description: 'Updated state', required: false })
  state?: string;
}
