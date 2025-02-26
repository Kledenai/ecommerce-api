import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async createCart(data: { userId: number }) {
    return this.prisma.cart.create({
      data,
    });
  }

  async getCartByUserId(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: true,
      },
    });
  
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    return cart;
  }
  
  async updateCart(id: number, data: { productId: number; quantity: number }) {
    return this.prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: id,
          productId: data.productId,
        },
      },
      data: {
        quantity: data.quantity,
      },
    });
  }
  

  async deleteCart(id: number) {
    return this.prisma.cart.delete({
      where: { id },
    });
  }
}
