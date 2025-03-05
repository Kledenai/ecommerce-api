import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UseGuards, Delete, Param, Post, Body, Get, Put, Req } from '@nestjs/common';
import { UpdateCartItemDto } from 'modules/cart-item/dtos/update-cart-item.dto';
import { AddCartItemDto } from 'modules/cart-item/dtos/add-cart-item.dto';
import { CartItemService } from 'modules/cart-item/cart-item.service';
import { AuthUserRequest } from 'modules/auth/auth-user-request';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';

@Controller('cart-items')
@UseGuards(JwtAuthGuard)
@ApiTags('Cart Items')
@ApiBearerAuth()
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post(':cartId')
  @ApiOperation({ summary: 'Add item to cart', description: 'Adds a new product to the cart.' })
  @ApiParam({ name: 'cartId', type: 'number', example: 1, description: 'ID of the cart' })
  @ApiBody({ type: AddCartItemDto })
  @ApiResponse({ status: 201, description: 'Item added successfully.' })
  async addCartItem(@Req() req: AuthUserRequest, @Param('cartId') cartId: number, @Body() body: AddCartItemDto) {
    return this.cartItemService.addCartItem(req.user.id, cartId, body);
  }


  @Get(':cartId')
  @ApiOperation({ summary: 'Get items from a cart', description: 'Retrieves all items in a cart by cart ID.' })
  @ApiParam({ name: 'cartId', type: 'number', example: 1, description: 'ID of the cart' })
  @ApiResponse({ status: 200, description: 'Cart items retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async getCartItems(@Req() req: AuthUserRequest, @Param('cartId') cartId: number) {
    return this.cartItemService.getCartItems(req.user.id, cartId);
  }

  @Put(':cartId')
  @ApiOperation({ summary: 'Update cart item', description: 'Updates the quantity of an item in the cart.' })
  @ApiParam({ name: 'cartId', type: 'number', example: 1, description: 'ID of the cart' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  async updateCartItem(@Req() req: AuthUserRequest, @Param('cartId') cartId: number, @Body() body: UpdateCartItemDto) {
    return this.cartItemService.updateCartItem(req.user.id, cartId, body);
  }

  @Delete(':cartId/:productId')
  @ApiOperation({ summary: 'Delete cart item', description: 'Removes a product from the cart.' })
  @ApiParam({ name: 'cartId', type: 'number', example: 1, description: 'ID of the cart' })
  @ApiParam({ name: 'productId', type: 'number', example: 123, description: 'ID of the product' })
  @ApiResponse({ status: 200, description: 'Cart item deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  async deleteCartItem(@Req() req: AuthUserRequest, @Param('cartId') cartId: number, @Param('productId') productId: number) {
    return this.cartItemService.deleteCartItem(req.user.id, cartId, productId);
  }
}
