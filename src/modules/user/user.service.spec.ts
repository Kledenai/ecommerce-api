import { UserService } from 'modules/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

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
    it('should create a user with hashed password', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      const savedUser = { ...userData, password: 'hashed-password' };

      mockPrismaService.user.create.mockResolvedValue(savedUser);

      const result = await service.createUser(userData);

      expect(result).toEqual(savedUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { ...userData, password: 'hashed-password' },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    });

    it('should throw an error if email is already in use', async () => {
      mockPrismaService.user.create.mockRejectedValue({ code: 'P2002' });

      await expect(
        service.createUser({
          email: 'user@example.com',
          password: 'password123',
          name: 'John Doe',
        }),
      ).rejects.toThrow('Email already in use');
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
      const user = { id: 1, email: 'user@example.com', name: 'John Doe' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getUserById(1);

      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById(999)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'user@example.com', name: 'John Doe' };
  
      mockPrismaService.user.findUnique.mockResolvedValue(user);
  
      const result = await service.getUserByEmail('user@example.com');
  
      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@example.com' },
        select: { id: true, email: true, name: true },
      });
    });
  
    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
  
      await expect(service.getUserByEmail('nonexistent@example.com'))
        .rejects
        .toThrow(NotFoundException);
    });
  });  

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedUser = {
        id: 1,
        email: 'updated@example.com',
        name: 'Updated Name',
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, {
        email: 'updated@example.com',
        name: 'Updated Name',
      });

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { email: 'updated@example.com', name: 'Updated Name' },
      });
    });

    it('should hash password before updating', async () => {
      const updatedUser = {
        id: 1,
        email: 'updated@example.com',
        name: 'Updated Name',
        password: 'hashed-password',
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, {
        email: 'updated@example.com',
        name: 'Updated Name',
        password: 'newpassword',
      });

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { email: 'updated@example.com', name: 'Updated Name', password: 'hashed-password' },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userToDelete = { id: 1, email: 'user@example.com', name: 'John Doe' };

      mockPrismaService.user.delete.mockResolvedValue(userToDelete);

      const result = await service.deleteUser(1);

      expect(result).toEqual(userToDelete);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.delete.mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.deleteUser(999)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });
});
