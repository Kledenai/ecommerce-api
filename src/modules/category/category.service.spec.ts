import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CategoryService } from 'modules/category/category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';

const mockPrismaService = {
  category: {
    create: jest.fn().mockResolvedValue({ id: 1, name: 'Mock Category' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Category' }),
    delete: jest.fn().mockResolvedValue({ id: 1, name: 'Deleted Category' }),
    findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Category 1' }]),
    findUnique: jest.fn().mockResolvedValue(null),
  },
} as unknown as { category: { create: jest.Mock; update: jest.Mock; delete: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock } };

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService) as unknown as typeof mockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const categoryData = { name: 'Category 1' };
      prisma.category.create.mockResolvedValue(categoryData);

      const result = await service.createCategory(categoryData);

      expect(result).toEqual(categoryData);
      expect(prisma.category.create).toHaveBeenCalledWith({ data: categoryData });
    });

    it('should throw BadRequestException on error', async () => {
      prisma.category.create.mockRejectedValue(new Error());
      await expect(service.createCategory({ name: 'Invalid' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCategories', () => {
    it('should return a list of categories', async () => {
      const categories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
      prisma.category.findMany.mockResolvedValue(categories);

      const result = await service.getCategories();
      expect(result).toEqual(categories);
      expect(prisma.category.findMany).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const category = { id: 1, name: 'Category 1', products: [] };
      prisma.category.findUnique.mockResolvedValue(category);

      const result = await service.getCategoryById(1);

      expect(result).toEqual(category);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { products: true } });
    });

    it('should throw NotFoundException if category is not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.getCategoryById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updatedCategory = { id: 1, name: 'Updated Category' };
      prisma.category.findUnique.mockResolvedValue(updatedCategory);
      prisma.category.update.mockResolvedValue(updatedCategory);

      const result = await service.updateCategory(1, { name: 'Updated Category' });

      expect(result).toEqual(updatedCategory);
      expect(prisma.category.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { name: 'Updated Category' } });
    });

    it('should throw NotFoundException if category is not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.updateCategory(999, { name: 'Does not exist' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const categoryToDelete = { id: 1, name: 'Category 1', products: [] };
      prisma.category.findUnique.mockResolvedValue(categoryToDelete);
      prisma.category.delete.mockResolvedValue(categoryToDelete);

      const result = await service.deleteCategory(1);
      expect(result).toEqual(categoryToDelete);
      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if category is not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.deleteCategory(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if category has associated products', async () => {
      prisma.category.findUnique.mockResolvedValue({ id: 1, name: 'Category 1', products: [{ id: 1, name: 'Product' }] });
      await expect(service.deleteCategory(1)).rejects.toThrow(BadRequestException);
    });
  });
});