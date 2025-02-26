import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({ example: 1, description: 'ID of the user' })
  userId: number;
}
