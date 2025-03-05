import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async validateOrderOwnership(orderId: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new Error('Unauthorized: You do not own this order.');
    }
  }

  async addOrderItem(userId: number, orderId: number, data: { productId: number; quantity: number }) {
    await this.validateOrderOwnership(orderId, userId);

    return this.prisma.orderItem.create({
      data: {
        orderId,
        productId: data.productId,
        quantity: data.quantity,
      },
    });
  }

  async deleteOrderItem(userId: number, orderId: number, productId: number) {
    await this.validateOrderOwnership(orderId, userId);

    return this.prisma.orderItem.delete({
      where: {
        orderId_productId: { orderId, productId },
      },
    });
  }
}
