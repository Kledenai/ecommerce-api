import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({ example: 'shipped', description: 'New status of the order' })
  @IsString()
  @IsIn(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], { message: 'Invalid status' })
  status: string;
}
