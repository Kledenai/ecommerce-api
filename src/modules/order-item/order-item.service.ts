import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async addOrderItem(data: { orderId: number; productId: number; quantity: number }) {
    return this.prisma.orderItem.create({
      data,
    });
  }

  async deleteOrderItem(orderId: number, productId: number) {
    return this.prisma.orderItem.delete({
      where: {
        orderId_productId: { orderId, productId },
      },
    });
  }
}
