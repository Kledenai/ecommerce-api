import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async validateOrderOwnership(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
    });
  
    if (!order) {
      throw new Error('Unauthorized: You do not own this order.');
    }
  }  

  async createOrder(data: { userId: number; items: { productId: number; quantity: number }[] }) {
    const { userId, items } = data;
  
    if (items.length === 0) {
      throw new Error("Order must contain at least one item.");
    }
  
    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map(item => item.productId) } },
    });
  
    if (products.length !== items.length) {
      throw new Error("Some products in the order do not exist.");
    }
  
    const total = items.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      return product ? acc + product.price * item.quantity : acc;
    }, 0);
  
    const order = await this.prisma.order.create({
      data: { userId, status: 'PENDING', total },
    });
  
    const orderItems = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    }));
  
    await this.prisma.orderItem.createMany({ data: orderItems });
  
    return order;
  }

  async getOrdersByUserId(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        OrderItem: true,
      },
    });
  }

  async getOrderById(id: number, userId: number) {
    return this.prisma.order.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        OrderItem: true,
      },
    })
  }

  async updateOrder(id: number, userId: number, data: { status: string }) {
    await this.validateOrderOwnership(id, userId);
  
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }
  
  async deleteOrder(id: number, userId: number) {
    await this.validateOrderOwnership(id, userId);
  
    return this.prisma.order.delete({
      where: { id },
    });
  }
  
}
