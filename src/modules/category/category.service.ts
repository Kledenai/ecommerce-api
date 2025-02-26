import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: { name: string }) {
    return this.prisma.category.create({
      data,
    });
  }

  async getCategories() {
    return this.prisma.category.findMany();
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: number, data: { name?: string }) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
