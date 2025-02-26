import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { OrderService } from 'modules/order/order.service';
import { OrderController } from 'modules/order/order.controller';

@Module({
  imports: [PrismaModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
