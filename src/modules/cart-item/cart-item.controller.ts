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
import { CartItemService } from 'modules/cart-item/cart-item.service';

@Controller('cart-items')
@UseGuards(JwtAuthGuard)
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  async addCartItem(
    @Body() body: { cartId: number; productId: number; quantity: number },
  ) {
    return this.cartItemService.addCartItem(body);
  }

  @Get(':cartId')
  async getCartItems(@Param('cartId') cartId: number) {
    return this.cartItemService.getCartItems(cartId);
  }

  @Put(':cartId')
  async updateCartItem(
    @Param('cartId') cartId: number,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartItemService.updateCartItem(cartId, body);
  }

  @Delete(':cartId/:productId')
  async deleteCartItem(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
  ) {
    return this.cartItemService.deleteCartItem(cartId, productId);
  }
}
