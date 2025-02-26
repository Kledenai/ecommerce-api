import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'modules/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'modules/user/user.service';
import { UserController } from 'modules/user/user.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
