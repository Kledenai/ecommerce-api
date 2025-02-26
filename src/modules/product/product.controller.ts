import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { ProductService } from 'modules/product/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body()
    body: {
      name: string;
      price: number;
      description?: string;
      imageUrl: string;
      categoryId: number;
    },
  ) {
    return this.productService.createProduct(body);
  }

  @Get()
  async getProducts() {
    return this.productService.getProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() body: { name?: string; price?: number; description?: string; categoryId?: number },
  ) {
    return this.productService.updateProduct(id, body);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
