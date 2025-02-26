import { ApiProperty } from '@nestjs/swagger';

export class CreateShippingAddressDto {
  @ApiProperty({ example: 1, description: 'ID of the user' })
  userId: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the recipient' })
  fullName: string;

  @ApiProperty({ example: '123 Main St', description: 'First line of the address' })
  addressLine1: string;

  @ApiProperty({ example: 'Apt 4B', description: 'Second line of the address', required: false })
  addressLine2?: string;

  @ApiProperty({ example: 'New York', description: 'City' })
  city: string;

  @ApiProperty({ example: 'NY', description: 'State' })
  state: string;

  @ApiProperty({ example: 'USA', description: 'Country' })
  country: string;

  @ApiProperty({ example: '10001', description: 'Postal Code' })
  postalCode: string;
}
