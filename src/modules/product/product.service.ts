import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { unlink } from 'fs/promises';
import * as dotenv from 'dotenv';
import { Multer } from 'multer';
import { join } from 'path';

dotenv.config();

@Injectable()
export class ProductService {
  private readonly appUrl: string;

  constructor(private prisma: PrismaService) {
    this.appUrl = process.env.APP_URL || 'http://localhost:3000';
  }

  async createProduct(
    data: { name: string; price: number; description?: string; categoryId: number },
    image?: Multer.File
  ) {
    if (!image) {
      throw new NotFoundException('Image is required.');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    const imageUrl = `${this.appUrl}/uploads/products/${image.filename}`;

    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description || '',
        imageUrl,
        categoryId: data.categoryId,
      },
    });
  }

  async getProducts() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getImagePath(fileName: string) {
    return join(__dirname, '..', '..', 'uploads', 'products', fileName);
  }

  async updateProduct(id: number, data: UpdateProductDto, image?: Multer.File) {
    let imageUrl: string | undefined = undefined;
  
    if (image) {
      imageUrl = `${process.env.APP_URL}/uploads/products/${image.filename}`;
    }
  
    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        imageUrl: imageUrl ?? data.imageUrl,
      },
    });
  }

  async deleteProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
  
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.imageUrl) {
      const fileName = product.imageUrl.split('/').pop();
  
      if (fileName) {
        const filePath = await this.getImagePath(fileName);
  
        try {
          await unlink(filePath);
        } catch (error) {
          console.error(`Erro ao deletar imagem: ${error.message}`);
        }
      }
    }
  
    return this.prisma.product.delete({ where: { id } });
  }
  
}
