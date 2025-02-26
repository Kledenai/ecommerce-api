import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'modules/user/user.service';
import { UserController } from 'modules/user/user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
