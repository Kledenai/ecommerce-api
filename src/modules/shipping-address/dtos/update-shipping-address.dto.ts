import { CreateShippingAddressDto } from './create-shipping-address.dto';
import { IsOptional, IsString, IsPostalCode } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateShippingAddressDto extends PartialType(CreateShippingAddressDto) {
  @ApiProperty({ example: 'New York', description: 'Updated city', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'NY', description: 'Updated state', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '10001', description: 'Updated postal code', required: false })
  @IsOptional()
  @IsPostalCode('any')
  postalCode?: string;
}
