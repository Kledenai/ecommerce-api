import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryService } from 'modules/category/category.service';

const mockPrismaService = {
  category: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const categoryData = { name: 'Category 1' };

      mockPrismaService.category.create.mockResolvedValue(categoryData);

      const result = await service.createCategory(categoryData);

      expect(result).toEqual(categoryData);
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: categoryData,
      });
    });
  });

  describe('getCategories', () => {
    it('should return a list of categories', async () => {
      const categoriesList = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];

      mockPrismaService.category.findMany.mockResolvedValue(categoriesList);

      const result = await service.getCategories();

      expect(result).toEqual(categoriesList);
      expect(mockPrismaService.category.findMany).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const category = { id: 1, name: 'Category 1' };

      mockPrismaService.category.findUnique.mockResolvedValue(category);

      const result = await service.getCategoryById(1);

      expect(result).toEqual(category);
      expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw an error if category is not found', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.getCategoryById(999)).rejects.toThrowError(
        'Category not found',
      );
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updatedCategory = { id: 1, name: 'Updated Category' };

      mockPrismaService.category.update.mockResolvedValue(updatedCategory);

      const result = await service.updateCategory(1, { name: 'Updated Category' });

      expect(result).toEqual(updatedCategory);
      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated Category' },
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const categoryToDelete = { id: 1, name: 'Category 1' };

      mockPrismaService.category.delete.mockResolvedValue(categoryToDelete);

      const result = await service.deleteCategory(1);

      expect(result).toEqual(categoryToDelete);
      expect(mockPrismaService.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
