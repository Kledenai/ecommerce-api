import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: { userId: number; items: { productId: number; quantity: number }[] }) {
    const { userId, items } = data;
  
    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map(item => item.productId) } },
    });
  
    const total = items.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        acc += product.price * item.quantity;
      }
      return acc;
    }, 0);
  
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        total,
      },
    });

    const orderItems = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    }));

    await this.prisma.orderItem.createMany({
      data: orderItems,
    });
  
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

  async updateOrder(id: number, data: { status: string }) {
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async deleteOrder(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
