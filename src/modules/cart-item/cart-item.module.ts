import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'modules/auth/auth.module';
import { CartItemService } from 'modules/cart-item/cart-item.service';
import { CartItemController } from 'modules/cart-item/cart-item.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CartItemService],
  controllers: [CartItemController],
})
export class CartItemModule {}
