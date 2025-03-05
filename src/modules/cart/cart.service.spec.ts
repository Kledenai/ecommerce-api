import { CartService } from 'modules/cart/cart.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let mockPrismaService: {
    cart: { create: jest.Mock; findFirst: jest.Mock; findUnique: jest.Mock; delete: jest.Mock };
    cartItem: { updateMany: jest.Mock };
  };

  beforeEach(async () => {
    mockPrismaService = {
      cart: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      cartItem: {
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCart', () => {
    it('should create a cart for the authenticated user', async () => {
      const cartData = { userId: 1 };
      const createdCart = { id: 1, userId: 1 };

      mockPrismaService.cart.create.mockResolvedValue(createdCart);

      const result = await service.createCart(cartData);

      expect(result).toEqual(createdCart);
      expect(mockPrismaService.cart.create).toHaveBeenCalledWith({ data: cartData });
    });
  });

  describe('getCartById', () => {
    it('should return a specific cart if it belongs to the authenticated user', async () => {
      const cart = { id: 1, userId: 1, items: [] };
      mockPrismaService.cart.findUnique.mockResolvedValue(cart);

      const result = await service.getCartById(1, 1);

      expect(result).toEqual(cart);
      expect(mockPrismaService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        include: { items: true },
      });
    });

    it('should throw Error if the cart is not found', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      await expect(service.getCartById(999, 1)).rejects.toThrow("Cart not found");
    });
  });

  describe('getCartByUserId', () => {
    it('should return the most recent cart for the user', async () => {
      const cart = { id: 1, userId: 1, items: [] };
      mockPrismaService.cart.findFirst.mockResolvedValue(cart);

      const result = await service.getCartByUserId(1);

      expect(result).toEqual(cart);
      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { items: true },
      });
    });

    it('should throw NotFoundException if no cart is found', async () => {
      mockPrismaService.cart.findFirst.mockResolvedValue(null);

      await expect(service.getCartByUserId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCart', () => {
    it('should update a cart item if the user owns the cart', async () => {
      const cart = { id: 1, userId: 1 };
      const updatedItem = { productId: 1, quantity: 3 };

      mockPrismaService.cart.findFirst.mockResolvedValue(cart);
      mockPrismaService.cartItem.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.updateCart(1, 1, updatedItem);

      expect(result).toEqual({ message: 'Cart updated successfully' });
      expect(mockPrismaService.cartItem.updateMany).toHaveBeenCalledWith({
        where: { cartId: 1, productId: 1 },
        data: { quantity: 3 },
      });
    });

    it('should throw Error if cart does not exist', async () => {
      mockPrismaService.cart.findFirst.mockResolvedValue(null);

      await expect(service.updateCart(1, 1, { productId: 1, quantity: 3 })).rejects.toThrow("Cart not found");
    });

    it('should throw Error if product is not found in cart', async () => {
      mockPrismaService.cart.findFirst.mockResolvedValue({ id: 1, userId: 1 });
      mockPrismaService.cartItem.updateMany.mockResolvedValue({ count: 0 });

      await expect(service.updateCart(1, 1, { productId: 1, quantity: 3 })).rejects.toThrow("Product not found in cart or unauthorized");
    });
  });

  describe('deleteCart', () => {
    it('should delete a cart if it belongs to the authenticated user', async () => {
      const cartToDelete = { id: 1, userId: 1 };

      mockPrismaService.cart.findFirst.mockResolvedValue(cartToDelete);
      mockPrismaService.cart.delete.mockResolvedValue(cartToDelete);

      const result = await service.deleteCart(1, 1);

      expect(result).toEqual(cartToDelete);
      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        select: { id: true },
      });
      expect(mockPrismaService.cart.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw Error if the cart does not belong to the user', async () => {
      mockPrismaService.cart.findFirst.mockResolvedValue(null);

      await expect(service.deleteCart(1, 1)).rejects.toThrow("Cart not found or unauthorized");
    });
  });
});
