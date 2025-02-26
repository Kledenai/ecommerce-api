import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { CartService } from 'modules/cart/cart.service';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { CreateCartDto } from 'modules/cart/dtos/create-cart.dto';
import { UpdateCartDto } from 'modules/cart/dtos/update-cart.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('carts')
@UseGuards(JwtAuthGuard)
@ApiTags('Cart')
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a cart', description: 'Creates a new cart for a user.' })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({ status: 201, description: 'Cart created successfully.' })
  async createCart(@Body() body: CreateCartDto) {
    return this.cartService.createCart(body);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get cart by user ID', description: 'Retrieves a cart by user ID.' })
  @ApiParam({ name: 'userId', type: 'number', example: 1, description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async getCartByUserId(@Param('userId') userId: number) {
    return this.cartService.getCartByUserId(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cart', description: 'Updates the cart by its ID.' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID of the cart' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'Cart updated successfully.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async updateCart(@Param('id') id: number, @Body() body: UpdateCartDto) {
    return this.cartService.updateCart(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart', description: 'Deletes a cart by its ID.' })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID of the cart' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async deleteCart(@Param('id') id: number) {
    return this.cartService.deleteCart(id);
  }
}
