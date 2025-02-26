import {
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { OrderService } from 'modules/order/order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() body: { userId: number; items: { productId: number; quantity: number }[] }) {
    return this.orderService.createOrder(body);
  }

  @Get(':userId')
  async getOrdersByUserId(@Param('userId') userId: number) {
    return this.orderService.getOrdersByUserId(userId);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: number, @Body() body: { status: string }) {
    return this.orderService.updateOrder(id, body);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }
}
