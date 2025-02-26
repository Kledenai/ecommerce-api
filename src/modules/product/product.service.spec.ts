import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { ProductService } from 'modules/product/product.service';

const mockPrismaService = {
  product: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
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
    it('should create a product', async () => {
      const productData = {
        name: 'Product 1',
        price: 100,
        description: 'A test product',
        imageUrl: 'http://image.url',
        category: 'Category 1',
      };

      mockPrismaService.product.create.mockResolvedValue(productData);

      const result = await service.createProduct(productData);

      expect(result).toEqual(productData);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: productData,
      });
    });
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const productList = [
        { id: 1, name: 'Product 1', price: 100, description: 'A test product' },
        {
          id: 2,
          name: 'Product 2',
          price: 200,
          description: 'Another test product',
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(productList);

      const result = await service.getProducts();

      expect(result).toEqual(productList);
      expect(mockPrismaService.product.findMany).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const product = {
        id: 1,
        name: 'Product 1',
        price: 100,
        description: 'A test product',
      };

      mockPrismaService.product.findUnique.mockResolvedValue(product);

      const result = await service.getProductById(1);

      expect(result).toEqual(product);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw an error if product is not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.getProductById(999)).rejects.toThrowError(
        'Product not found',
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updatedProduct = {
        id: 1,
        name: 'Updated Product',
        price: 150,
        description: 'Updated description',
      };

      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(1, {
        name: 'Updated Product',
        price: 150,
      });

      expect(result).toEqual(updatedProduct);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated Product', price: 150 },
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const productToDelete = {
        id: 1,
        name: 'Product to Delete',
        price: 100,
        description: 'A product to delete',
      };

      mockPrismaService.product.delete.mockResolvedValue(productToDelete);

      const result = await service.deleteProduct(1);

      expect(result).toEqual(productToDelete);
      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
