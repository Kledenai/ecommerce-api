import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'modules/auth/auth.module';
import { OrderItemService } from 'modules/order-item/order-item.service';
import { OrderItemController } from 'modules/order-item/order-item.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [OrderItemService],
  controllers: [OrderItemController],
})
export class OrderItemModule {}
