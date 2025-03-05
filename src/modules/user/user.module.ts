import { UserController } from 'modules/user/user.controller';
import { UserService } from 'modules/user/user.service';
import { AuthModule } from 'modules/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
