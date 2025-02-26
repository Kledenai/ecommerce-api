import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CartItemService {
  constructor(private prisma: PrismaService) {}

  async addCartItem(data: { cartId: number; productId: number; quantity: number }) {
    return this.prisma.cartItem.create({
      data,
    });
  }

  async getCartItems(cartId: number) {
    return this.prisma.cartItem.findMany({
      where: { cartId },
      include: {
        Product: true,
      },
    });
  }

  async updateCartItem(cartId: number, data: { productId: number; quantity: number }) {
    return this.prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId,
          productId: data.productId,
        },
      },
      data,
    });
  }

  async deleteCartItem(cartId: number, productId: number) {
    return this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }
}
