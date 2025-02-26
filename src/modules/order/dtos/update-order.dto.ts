import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({ example: 'shipped', description: 'New status of the order' })
  status: string;
}
