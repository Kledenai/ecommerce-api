import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: { name: string }) {
    try {
      return await this.prisma.category.create({
        data,
      });
    } catch (error) {
      throw new BadRequestException('Error creating category.');
    }
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        products: true,
      },
    });
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: number, data: { name?: string }) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.products.length > 0) {
      throw new BadRequestException('Cannot delete category with associated products.');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
