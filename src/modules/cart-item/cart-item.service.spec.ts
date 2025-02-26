import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { CartItemService } from 'modules/cart-item/cart-item.service';

const mockPrismaService = {
  cart: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
  },
  cartItem: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CartItemService', () => {
  let service: CartItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CartItemService>(CartItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addCartItem', () => {
    it('should add a cart item', async () => {
      const cartItemData = { cartId: 1, productId: 1, quantity: 2 };

      mockPrismaService.cartItem.create.mockResolvedValue(cartItemData);

      const result = await service.addCartItem(cartItemData);

      expect(result).toEqual(cartItemData);
      expect(mockPrismaService.cartItem.create).toHaveBeenCalledWith({
        data: cartItemData,
      });
    });
  });

  describe('getCartItems', () => {
    it('should return a list of cart items', async () => {
      const cartItemsList = [
        { cartId: 1, productId: 1, quantity: 2 },
        { cartId: 1, productId: 2, quantity: 3 },
      ];

      mockPrismaService.cartItem.findMany.mockResolvedValue(cartItemsList);

      const result = await service.getCartItems(1);

      expect(result).toEqual(cartItemsList);
      expect(mockPrismaService.cartItem.findMany).toHaveBeenCalledWith({
        where: { cartId: 1 },
        include: { Product: true },
      });
    });
  });

  describe('updateCartItem', () => {
    it('should update a cart item', async () => {
      const updatedCartItem = { cartId: 1, productId: 1, quantity: 5 };

      mockPrismaService.cartItem.update.mockResolvedValue(updatedCartItem);

      const result = await service.updateCartItem(1, {
        productId: 1,
        quantity: 5,
      });

      expect(result).toEqual(updatedCartItem);

      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { cartId_productId: { cartId: 1, productId: 1 } },
        data: { productId: 1, quantity: 5 },
      });
    });
  });

  describe('deleteCartItem', () => {
    it('should delete a cart item', async () => {
      const cartItemToDelete = { cartId: 1, productId: 1 };

      mockPrismaService.cartItem.delete.mockResolvedValue(cartItemToDelete);

      const result = await service.deleteCartItem(1, 1);

      expect(result).toEqual(cartItemToDelete);
      expect(mockPrismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { cartId_productId: { cartId: 1, productId: 1 } },
      });
    });
  });
});
