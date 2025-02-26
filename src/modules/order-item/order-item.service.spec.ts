import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { OrderItemService } from 'modules/order-item/order-item.service';

const mockPrismaService = {
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
    it('should add an order item', async () => {
      const orderItemData = { orderId: 1, productId: 1, quantity: 2 };

      mockPrismaService.orderItem.create.mockResolvedValue(orderItemData);

      const result = await service.addOrderItem(orderItemData);

      expect(result).toEqual(orderItemData);
      expect(mockPrismaService.orderItem.create).toHaveBeenCalledWith({
        data: orderItemData,
      });
    });
  });

  describe('deleteOrderItem', () => {
    it('should delete an order item', async () => {
      const orderItemToDelete = { orderId: 1, productId: 1 };

      mockPrismaService.orderItem.delete.mockResolvedValue(orderItemToDelete);

      const result = await service.deleteOrderItem(1, 1);

      expect(result).toEqual(orderItemToDelete);
      expect(mockPrismaService.orderItem.delete).toHaveBeenCalledWith({
        where: {
          orderId_productId: { orderId: 1, productId: 1 },
        },
      });
    });
  });
});
