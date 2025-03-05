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

  async getCartById(id: number, userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }
  
    return cart;
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
  
  async updateCart(id: number, userId: number, data: { productId: number; quantity: number }) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      select: { id: true },
    });
  
    if (!cart) {
      throw new Error("Cart not found");
    }

    const result = await this.prisma.cartItem.updateMany({
      where: {
        cartId: cart.id,
        productId: data.productId,
      },
      data: {
        quantity: data.quantity,
      },
    });
  
    if (result.count === 0) {
      throw new Error("Product not found in cart or unauthorized");
    }
  
    return { message: "Cart updated successfully" };
  }
  

  async deleteCart(id: number, userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { id: id, userId },
      select: { id: true },
    });
  
    if (!cart) {
      throw new Error("Cart not found or unauthorized");
    }
  
    return this.prisma.cart.delete({
      where: { id: cart.id },
    });
  }
}
