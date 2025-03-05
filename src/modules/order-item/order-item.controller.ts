import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AddOrderItemDto } from 'modules/order-item/dtos/add-order-item.dto';
import { OrderItemService } from 'modules/order-item/order-item.service';
import { AuthUserRequest } from 'modules/auth/auth-user-request';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';

@Controller('order-items')
@UseGuards(JwtAuthGuard)
@ApiTags('Order Items')
@ApiBearerAuth()
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post(':orderId')
  @ApiOperation({ summary: 'Add item to an order' })
  @ApiParam({ name: 'orderId', type: 'number', example: 1, description: 'Order ID' })
  @ApiBody({ type: AddOrderItemDto })
  @ApiResponse({ status: 201, description: 'Order item added successfully.' })
  @ApiResponse({ status: 403, description: 'Unauthorized: You do not own this order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async addOrderItem(
    @Req() req: AuthUserRequest,
    @Param('orderId') orderId: number,
    @Body() body: AddOrderItemDto
  ) {
    return this.orderItemService.addOrderItem(req.user.id, orderId, body);
  }

  @Delete(':orderId/:productId')
  @ApiOperation({ summary: 'Delete item from an order' })
  @ApiParam({ name: 'orderId', type: 'number', example: 1, description: 'Order ID' })
  @ApiParam({ name: 'productId', type: 'number', example: 123, description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Order item deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Unauthorized: You do not own this order.' })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  async deleteOrderItem(
    @Req() req: AuthUserRequest,
    @Param('orderId') orderId: number,
    @Param('productId') productId: number
  ) {
    return this.orderItemService.deleteOrderItem(req.user.id, orderId, productId);
  }
}
