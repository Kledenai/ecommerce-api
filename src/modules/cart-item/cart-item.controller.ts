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
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { CartItemService } from 'modules/cart-item/cart-item.service';
import { AddCartItemDto } from 'modules/cart-item/dtos/add-cart-item.dto';
import { UpdateCartItemDto } from 'modules/cart-item/dtos/update-cart-item.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('cart-items')
@UseGuards(JwtAuthGuard)
@ApiTags('Cart Items')
@ApiBearerAuth()
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to cart', description: 'Adds a new product to the cart.' })
  @ApiBody({ type: AddCartItemDto })
  @ApiResponse({ status: 201, description: 'Item added successfully.' })
  async addCartItem(@Body() body: AddCartItemDto) {
    return this.cartItemService.addCartItem(body);
  }

  @Get(':cartId')
  @ApiOperation({ summary: 'Get items from a cart', description: 'Retrieves all items in a cart by cart ID.' })
  @ApiParam({ name: 'cartId', type: 'number', example: 1, description: 'ID of the cart' })
  @ApiResponse({ status: 200, description: 'Cart items retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async getCartItems(@Param('cartId') cartId: number) {
    return this.cartItemService.getCartItems(cartId);
  }

  @Put(':cartId')
  @ApiOperation({ summary: 'Update cart item', description: 'Updates the quantity of an item in the cart.' })
  @ApiParam({ name: 'cartId', type: 'number', example: 1, description: 'ID of the cart' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  async updateCartItem(@Param('cartId') cartId: number, @Body() body: UpdateCartItemDto) {
    return this.cartItemService.updateCartItem(cartId, body);
  }

  @Delete(':cartId/:productId')
  @ApiOperation({ summary: 'Delete cart item', description: 'Removes a product from the cart.' })
  @ApiParam({ name: 'cartId', type: 'number', example: 1, description: 'ID of the cart' })
  @ApiParam({ name: 'productId', type: 'number', example: 123, description: 'ID of the product' })
  @ApiResponse({ status: 200, description: 'Cart item deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  async deleteCartItem(@Param('cartId') cartId: number, @Param('productId') productId: number) {
    return this.cartItemService.deleteCartItem(cartId, productId);
  }
}
