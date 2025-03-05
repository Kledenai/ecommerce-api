import { CartController } from 'modules/cart/cart.controller';
import { CartService } from 'modules/cart/cart.service';
import { AuthModule } from 'modules/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
