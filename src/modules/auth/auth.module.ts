import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from 'modules/user/user.module';
import { AuthService } from 'modules/auth/auth.service';
import { JwtStrategy } from 'modules/auth/jwt.strategy';
import { AuthController } from 'modules/auth/auth.controller';

@Module({
  imports: [PrismaModule, forwardRef(() => UserModule)],
  providers: [AuthService, JwtService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
