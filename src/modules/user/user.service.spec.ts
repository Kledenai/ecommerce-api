import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'modules/user/user.service';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      mockPrismaService.user.create.mockResolvedValue(userData);

      const result = await service.createUser(userData);

      expect(result).toEqual(userData);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const userList = [
        { id: 1, email: 'user1@example.com', name: 'John Doe' },
        { id: 2, email: 'user2@example.com', name: 'Jane Doe' },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(userList);

      const result = await service.getUsers();

      expect(result).toEqual(userList);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user = {
        id: 1,
        email: 'user@example.com',
        name: 'John Doe',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getUserById(1);

      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw an error if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById(999)).rejects.toThrowError(
        'User not found',
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedUser = {
        id: 1,
        email: 'updateduser@example.com',
        name: 'Updated Name',
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, {
        email: 'updateduser@example.com',
        name: 'Updated Name',
      });

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { email: 'updateduser@example.com', name: 'Updated Name' },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userToDelete = {
        id: 1,
        email: 'user@example.com',
        name: 'John Doe',
      };

      mockPrismaService.user.delete.mockResolvedValue(userToDelete);

      const result = await service.deleteUser(1);

      expect(result).toEqual(userToDelete);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
