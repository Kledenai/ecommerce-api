import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'modules/auth/auth.module';
import { OrderService } from 'modules/order/order.service';
import { OrderController } from 'modules/order/order.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
