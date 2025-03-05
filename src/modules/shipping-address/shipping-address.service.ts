import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingAddressService {
  constructor(private prisma: PrismaService) {}

  async validateAddressOwnership(userId: number, id: number) {
    const address = await this.prisma.shippingAddress.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new Error('Unauthorized: You do not own this shipping address.');
    }
  }

  async createShippingAddress(userId: number, data: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) {
    return this.prisma.shippingAddress.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async getShippingAddresses(userId: number) {
    return this.prisma.shippingAddress.findMany({
      where: { userId },
    });
  }

  async updateShippingAddress(userId: number, id: number, data: {
    fullName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }) {
    await this.validateAddressOwnership(userId, id);

    return this.prisma.shippingAddress.update({
      where: { id },
      data,
    });
  }

  async deleteShippingAddress(userId: number, id: number) {
    await this.validateAddressOwnership(userId, id);

    return this.prisma.shippingAddress.delete({
      where: { id },
    });
  }
}
