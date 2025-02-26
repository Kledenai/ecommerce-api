import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CartService } from 'modules/cart/cart.service';
import { CartController } from 'modules/cart/cart.controller';

@Module({
  imports: [PrismaModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
