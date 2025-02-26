import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'updated@example.com', description: 'Updated email', required: false })
  email?: string;

  @ApiProperty({ example: 'newpassword123', description: 'Updated password', required: false })
  password?: string;

  @ApiProperty({ example: 'John Updated', description: 'Updated full name', required: false })
  name?: string;
}
