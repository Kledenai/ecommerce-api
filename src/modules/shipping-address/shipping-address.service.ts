import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ShippingAddressService {
  constructor(private prisma: PrismaService) {}

  async createShippingAddress(data: {
    userId: number;
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
        userId: data.userId,
        fullName: data.fullName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
      },
    });
  }

  async updateShippingAddress(id: number, data: {
    fullName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }) {
    return this.prisma.shippingAddress.update({
      where: { id },
      data,
    });
  }

  async deleteShippingAddress(id: number) {
    return this.prisma.shippingAddress.delete({
      where: { id },
    });
  }
}
