import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CartItemService } from 'modules/cart-item/cart-item.service';
import { CartItemController } from 'modules/cart-item/cart-item.controller';

@Module({
  imports: [PrismaModule],
  providers: [CartItemService],
  controllers: [CartItemController],
})
export class CartItemModule {}
