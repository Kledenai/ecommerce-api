import { IsString, IsOptional, IsPostalCode } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShippingAddressDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the recipient' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '123 Main St', description: 'First line of the address' })
  @IsString()
  addressLine1: string;

  @ApiProperty({ example: 'Apt 4B', description: 'Second line of the address', required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ example: 'New York', description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'NY', description: 'State' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'USA', description: 'Country' })
  @IsString()
  country: string;

  @ApiProperty({ example: '10001', description: 'Postal Code' })
  @IsPostalCode('any')
  postalCode: string;
}
