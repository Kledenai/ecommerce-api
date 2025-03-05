import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartItemService {
  constructor(private prisma: PrismaService) {}

  async validateCartOwnership(cartId: number, userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { id: cartId, userId },
    });
  
    if (!cart) {
      throw new Error('Unauthorized: You do not own this cart.');
    }
  }
  

  async addCartItem(userId: number, cartId: number, data: { productId: number; quantity: number }) {
    await this.validateCartOwnership(cartId, userId);
  
    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId: data.productId,
        quantity: data.quantity,
      },
    });
  }
  

  async getCartItems(userId: number, cartId: number) {
    await this.validateCartOwnership(cartId, userId);

    return this.prisma.cartItem.findMany({
      where: { cartId },
      include: { Product: true },
    });
  }

  async updateCartItem(userId: number, cartId: number, data: { productId: number; quantity: number }) {
    await this.validateCartOwnership(cartId, userId);

    return this.prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId: data.productId } },
      data,
    });
  }

  async deleteCartItem(userId: number, cartId: number, productId: number) {
    await this.validateCartOwnership(cartId, userId);

    return this.prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });
  }
}
