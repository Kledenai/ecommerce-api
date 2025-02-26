import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { OrderItemService } from 'modules/order-item/order-item.service';
import { OrderItemController } from 'modules/order-item/order-item.controller';

@Module({
  imports: [PrismaModule],
  providers: [OrderItemService],
  controllers: [OrderItemController],
})
export class OrderItemModule {}
