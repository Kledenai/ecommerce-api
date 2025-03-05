import { CreateOrderDto } from 'modules/order/dtos/create-order.dto';
import { UpdateOrderDto } from 'modules/order/dtos/update-order.dto';
import { AuthUserRequest } from 'modules/auth/auth-user-request';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { OrderService } from 'modules/order/order.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import {
  Controller,
  UseGuards,
  Delete,
  Param,
  Post,
  Body,
  Get,
  Put,
  Req,
} from '@nestjs/common';

@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiTags('Orders')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request (e.g., empty order, invalid product IDs).' })
  async createOrder(@Req() req: AuthUserRequest, @Body() body: CreateOrderDto) {
    return this.orderService.createOrder({ userId: req.user.id, ...body });
  }

  @Get()
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Orders not found.' })
  async getOrdersByUserId(@Req() req: AuthUserRequest) {
    return this.orderService.getOrdersByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Unauthorized: You do not own this order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async getOrderById(@Req() req: AuthUserRequest, @Param('id') id: number) {
    return this.orderService.getOrderById(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order status' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid status value.' })
  @ApiResponse({ status: 403, description: 'Unauthorized: You do not own this order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async updateOrder(@Req() req: AuthUserRequest, @Param('id') id: number, @Body() body: UpdateOrderDto) {
    return this.orderService.updateOrder(id, req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Unauthorized: You do not own this order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async deleteOrder(@Req() req: AuthUserRequest, @Param('id') id: number) {
    return this.orderService.deleteOrder(id, req.user.id);
  }
}
