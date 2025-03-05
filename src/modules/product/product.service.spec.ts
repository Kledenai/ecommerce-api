import { UpdateProductDto } from 'modules/product/dtos/update-product.dto';
import { ProductService } from 'modules/product/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { Multer } from 'multer';

jest.mock('fs/promises', () => ({
  unlink: jest.fn().mockResolvedValue(undefined),
}));

const mockPrismaService = {
  product: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  category: {
    findUnique: jest.fn(),
  },
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should throw error if image is not provided', async () => {
      const productData = {
        name: 'Product 1',
        price: 100,
        description: 'A test product',
        categoryId: 1,
      };

      await expect(service.createProduct(productData, undefined)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create a product', async () => {
      const productData = {
        name: 'Product 1',
        price: 100,
        description: 'A test product',
        categoryId: 1,
      };

      const mockImage = { filename: 'test-image.jpg' } as Multer.File;

      mockPrismaService.category.findUnique.mockResolvedValue({ id: 1, name: 'Category 1' });
      mockPrismaService.product.create.mockResolvedValue({
        ...productData,
        imageUrl: `http://localhost:3000/uploads/products/${mockImage.filename}`,
      });

      const result = await service.createProduct(productData, mockImage);

      expect(result).toEqual({
        ...productData,
        imageUrl: `http://localhost:3000/uploads/products/${mockImage.filename}`,
      });

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          ...productData,
          imageUrl: `http://localhost:3000/uploads/products/${mockImage.filename}`,
        },
      });
      expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: productData.categoryId },
      });
    });
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const productList = [
        { id: 1, name: 'Product 1', price: 100, description: 'A test product' },
        { id: 2, name: 'Product 2', price: 200, description: 'Another test product' },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(productList);

      const result = await service.getProducts();

      expect(result).toEqual(productList);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        include: { category: true },
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const product = {
        id: 1,
        name: 'Product 1',
        price: 100,
        description: 'A test product',
        category: { id: 1, name: 'Category 1' },
      };

      mockPrismaService.product.findUnique.mockResolvedValue(product);

      const result = await service.getProductById(1);

      expect(result).toEqual(product);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { category: true },
      });
    });

    it('should throw an error if product is not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.getProductById(999)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product without changing the image', async () => {
      const updateDto: UpdateProductDto = { name: 'Updated Product', price: 150 };

      mockPrismaService.product.update.mockResolvedValue({
        id: 1,
        name: 'Updated Product',
        price: 150,
        description: 'Updated description',
        imageUrl: 'http://localhost:3000/uploads/products/old-image.jpg',
      });

      const result = await service.updateProduct(1, updateDto, undefined);

      expect(result).toEqual({
        id: 1,
        name: 'Updated Product',
        price: 150,
        description: 'Updated description',
        imageUrl: 'http://localhost:3000/uploads/products/old-image.jpg',
      });

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('should update a product with a new image', async () => {
      const updateDto: UpdateProductDto = { name: 'Updated Product', price: 150 };
      const mockImage = { filename: 'new-image.jpg' } as Multer.File;

      mockPrismaService.product.update.mockResolvedValue({
        id: 1,
        name: 'Updated Product',
        price: 150,
        description: 'Updated description',
        imageUrl: `http://localhost:3000/uploads/products/${mockImage.filename}`,
      });

      const result = await service.updateProduct(1, updateDto, mockImage);

      expect(result).toEqual({
        id: 1,
        name: 'Updated Product',
        price: 150,
        description: 'Updated description',
        imageUrl: `http://localhost:3000/uploads/products/${mockImage.filename}`,
      });

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateDto,
          imageUrl: `http://localhost:3000/uploads/products/${mockImage.filename}`,
        },
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and remove the image file', async () => {
      const productToDelete = {
        id: 1,
        name: 'Product to Delete',
        price: 100,
        description: 'A product to delete',
        imageUrl: 'http://localhost:3000/uploads/products/test.jpg',
      };

      mockPrismaService.product.findUnique.mockResolvedValue(productToDelete);
      mockPrismaService.product.delete.mockResolvedValue(productToDelete);

      const result = await service.deleteProduct(1);

      expect(result).toEqual(productToDelete);
      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(unlink).toHaveBeenCalled();
    });

    it('should throw an error if product is not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.deleteProduct(999)).rejects.toThrowError(NotFoundException);
    });
  });
});
