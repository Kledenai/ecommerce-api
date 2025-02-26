import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'bob@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: '10203040', description: 'User password' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...', description: 'JWT Token' })
  accessToken: string;

  @ApiProperty({ example: 3600, description: 'Token expiration time in seconds' })
  expiresIn: number;
}
