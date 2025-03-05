import { OrderItemController } from 'modules/order-item/order-item.controller';
import { OrderItemService } from 'modules/order-item/order-item.service';
import { AuthModule } from 'modules/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [OrderItemService],
  controllers: [OrderItemController],
  exports: [OrderItemService],
})
export class OrderItemModule {}
