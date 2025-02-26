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
import { CartService } from 'modules/cart/cart.service';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCart(@Body() body: { userId: number }) {
    return this.cartService.createCart(body);
  }

  @Get(':userId')
  async getCartByUserId(@Param('userId') userId: number) {
    return this.cartService.getCartByUserId(userId);
  }

  @Put(':id')
  async updateCart(
    @Param('id') id: number,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartService.updateCart(id, body);
  }

  @Delete(':id')
  async deleteCart(@Param('id') id: number) {
    return this.cartService.deleteCart(id);
  }
}
