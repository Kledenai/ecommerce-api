import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { OrderItemService } from 'modules/order-item/order-item.service';
import { AddOrderItemDto } from 'modules/order-item/dtos/add-order-item.dto';
import { Controller, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('order-items')
@UseGuards(JwtAuthGuard)
@ApiTags('Order Items')
@ApiBearerAuth()
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to an order' })
  @ApiBody({ type: AddOrderItemDto })
  @ApiResponse({ status: 201, description: 'Order item added successfully.' })
  async addOrderItem(@Body() body: AddOrderItemDto) {
    return this.orderItemService.addOrderItem(body);
  }

  @Delete(':orderId/:productId')
  @ApiOperation({ summary: 'Delete item from an order' })
  @ApiParam({ name: 'orderId', type: 'number', example: 1 })
  @ApiParam({ name: 'productId', type: 'number', example: 123 })
  @ApiResponse({ status: 200, description: 'Order item deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  async deleteOrderItem(@Param('orderId') orderId: number, @Param('productId') productId: number) {
    return this.orderItemService.deleteOrderItem(orderId, productId);
  }
}
