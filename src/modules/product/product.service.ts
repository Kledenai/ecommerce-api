import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: {
    name: string;
    price: number;
    description?: string;
    imageUrl: string;
    category: string;
  }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description || '',
        imageUrl: data.imageUrl,
        category: data.category,
      },
    });
  }

  async getProducts() {
    return this.prisma.product.findMany();
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async updateProduct(
    id: number,
    data: { name?: string; price?: number; description?: string },
  ) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
