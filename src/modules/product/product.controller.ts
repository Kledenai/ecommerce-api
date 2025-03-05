import { UpdateProductWithImageDto } from './dtos/update-product-with-image.dto';
import { CreateProductDto } from 'modules/product/dtos/create-product.dto';
import { ProductService } from 'modules/product/product.service';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import {
  UseInterceptors,
  UploadedFile,
  Controller,
  UseGuards,
  Delete,
  Param,
  Post,
  Body,
  Get,
  Put,
} from '@nestjs/common';

@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiTags('Products')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Create a product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Laptop' },
        price: { type: 'number', example: 999.99 },
        description: { type: 'string', example: 'A high-performance laptop', nullable: true },
        categoryId: { type: 'number', example: 1 },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFile() image: Multer.File,
  ) {
    return this.productService.createProduct(body, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
  async getProducts() {
    return this.productService.getProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Update a product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProductWithImageDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async updateProduct(
    @Param('id') id: number,
    @Body() body: UpdateProductWithImageDto,
    @UploadedFile() image?: Multer.File,
  ) {
    return this.productService.updateProduct(id, body, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
