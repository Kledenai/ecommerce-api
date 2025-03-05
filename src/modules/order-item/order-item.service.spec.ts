import { OrderItemService } from 'modules/order-item/order-item.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';

const mockPrismaService = {
  order: {
    findFirst: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
    delete: jest.fn(),
  },
};

describe('OrderItemService', () => {
  let service: OrderItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addOrderItem', () => {
    it('should add an order item if the user owns the order', async () => {
      const userId = 1;
      const orderId = 1;
      const orderItemData = { productId: 1, quantity: 2 };

      mockPrismaService.order.findFirst.mockResolvedValue({ id: orderId, userId });
      mockPrismaService.orderItem.create.mockResolvedValue({ orderId, ...orderItemData });

      const result = await service.addOrderItem(userId, orderId, orderItemData);

      expect(result).toEqual({ orderId, ...orderItemData });
      expect(mockPrismaService.order.findFirst).toHaveBeenCalledWith({ where: { id: orderId, userId } });
      expect(mockPrismaService.orderItem.create).toHaveBeenCalledWith({
        data: { orderId, ...orderItemData },
      });
    });

    it('should throw an error if the user does not own the order', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.addOrderItem(1, 2, { productId: 1, quantity: 2 })).rejects.toThrow(
        'Unauthorized: You do not own this order.'
      );
    });
  });

  describe('deleteOrderItem', () => {
    it('should delete an order item if the user owns the order', async () => {
      const userId = 1;
      const orderId = 1;
      const productId = 1;
      const orderItemToDelete = { orderId, productId };

      mockPrismaService.order.findFirst.mockResolvedValue({ id: orderId, userId });
      mockPrismaService.orderItem.delete.mockResolvedValue(orderItemToDelete);

      const result = await service.deleteOrderItem(userId, orderId, productId);

      expect(result).toEqual(orderItemToDelete);
      expect(mockPrismaService.order.findFirst).toHaveBeenCalledWith({ where: { id: orderId, userId } });
      expect(mockPrismaService.orderItem.delete).toHaveBeenCalledWith({
        where: {
          orderId_productId: { orderId, productId },
        },
      });
    });

    it('should throw an error if the user does not own the order', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.deleteOrderItem(1, 2, 1)).rejects.toThrow(
        'Unauthorized: You do not own this order.'
      );
    });
  });
});
