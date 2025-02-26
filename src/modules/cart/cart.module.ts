import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'modules/auth/auth.module';
import { CartService } from 'modules/cart/cart.service';
import { CartController } from 'modules/cart/cart.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
