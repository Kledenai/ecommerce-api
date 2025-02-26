import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { OrderItemService } from 'modules/order-item/order-item.service';
import { Controller, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';

@Controller('order-items')
@UseGuards(JwtAuthGuard)
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  async addOrderItem(
    @Body() body: { orderId: number; productId: number; quantity: number },
  ) {
    return this.orderItemService.addOrderItem(body);
  }

  @Delete(':orderId/:productId')
  async deleteOrderItem(
    @Param('orderId') orderId: number,
    @Param('productId') productId: number,
  ) {
    return this.orderItemService.deleteOrderItem(orderId, productId);
  }
}
