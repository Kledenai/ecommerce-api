import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { CartService } from 'modules/cart/cart.service';

const mockPrismaService = {
  cart: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  cartItem: {
    update: jest.fn(),
  },
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
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
    it('should create a cart', async () => {
      const cartData = { userId: 1 };

      mockPrismaService.cart.create.mockResolvedValue(cartData);

      const result = await service.createCart(cartData);

      expect(result).toEqual(cartData);
      expect(mockPrismaService.cart.create).toHaveBeenCalledWith({
        data: cartData,
      });
    });
  });

  describe('getCartByUserId', () => {
    it('should return a cart by user ID', async () => {
      const cart = { id: 1, userId: 1, items: [] };

      mockPrismaService.cart.findFirst.mockResolvedValue(cart);

      const result = await service.getCartByUserId(1);

      expect(result).toEqual(cart);
      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { items: true },
      });
    });

    it('should throw an error if cart is not found', async () => {
      mockPrismaService.cart.findFirst.mockResolvedValue(null);

      await expect(service.getCartByUserId(999)).rejects.toThrowError(
        'Cart not found',
      );
    });
  });

  describe('updateCart', () => {
    it('should update a cart item', async () => {
      const updatedItem = { cartId: 1, productId: 1, quantity: 3 };

      mockPrismaService.cartItem.update.mockResolvedValue(updatedItem);

      const result = await service.updateCart(1, {
        productId: 1,
        quantity: 3,
      });

      expect(result).toEqual(updatedItem);
      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { cartId_productId: { cartId: 1, productId: 1 } },
        data: { quantity: 3 },
      });
    });
  });

  describe('deleteCart', () => {
    it('should delete a cart', async () => {
      const cartToDelete = { id: 1, userId: 1 };

      mockPrismaService.cart.delete.mockResolvedValue(cartToDelete);

      const result = await service.deleteCart(1);

      expect(result).toEqual(cartToDelete);
      expect(mockPrismaService.cart.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
