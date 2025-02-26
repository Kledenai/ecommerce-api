import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'modules/user/user.module';
import { AuthService } from 'modules/auth/auth.service';
import { JwtStrategy } from 'modules/auth/jwt.strategy';

@Module({
  imports: [UserModule],
  providers: [AuthService, JwtService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
