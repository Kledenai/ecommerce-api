import { OrderService } from 'modules/order/order.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';

const mockPrismaService = {
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  orderItem: {
    createMany: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
  },
};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order with items', async () => {
      const orderData = {
        userId: 1,
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 3 },
        ],
      };

      const mockProducts = [
        { id: 1, name: 'Product 1', price: 20 },
        { id: 2, name: 'Product 2', price: 30 },
      ];
      
      const calculatedTotal = orderData.items.reduce((sum, item) => {
        const product = mockProducts.find(p => p.id === item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0);

      const createdOrder = { 
        id: 1, 
        userId: 1, 
        status: 'PENDING',
        total: calculatedTotal, 
      };

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.order.create.mockResolvedValue(createdOrder);
      mockPrismaService.orderItem.createMany.mockResolvedValue([]);

      const result = await service.createOrder(orderData);

      expect(result).toEqual(createdOrder);

      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: { 
          userId: 1, 
          status: 'PENDING', 
          total: calculatedTotal, 
        },
      });

      expect(mockPrismaService.orderItem.createMany).toHaveBeenCalledWith({
        data: [
          { orderId: 1, productId: 1, quantity: 2 },
          { orderId: 1, productId: 2, quantity: 3 },
        ],
      });
    });
  });

  describe('getOrdersByUserId', () => {
    it('should return a list of orders', async () => {
      const orders = [
        { id: 1, userId: 1, status: 'PENDING' },
        { id: 2, userId: 1, status: 'SHIPPED' },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.getOrdersByUserId(1);

      expect(result).toEqual(orders);
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { OrderItem: true },
      });
    });
  });

  describe('updateOrder', () => {
    it('should update the order status if user owns the order', async () => {
      const updatedOrder = { id: 1, userId: 1, status: 'SHIPPED' };

      mockPrismaService.order.findFirst.mockResolvedValue(updatedOrder);
      mockPrismaService.order.update.mockResolvedValue(updatedOrder);

      const result = await service.updateOrder(1, 1, { status: 'SHIPPED' });

      expect(result).toEqual(updatedOrder);
      expect(mockPrismaService.order.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'SHIPPED' },
      });
    });

    it('should throw an error if the user does not own the order', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.updateOrder(1, 2, { status: 'SHIPPED' })).rejects.toThrow(
        'Unauthorized: You do not own this order.'
      );
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order if user owns it', async () => {
      const orderToDelete = { id: 1, userId: 1, status: 'PENDING' };

      mockPrismaService.order.findFirst.mockResolvedValue(orderToDelete);
      mockPrismaService.order.delete.mockResolvedValue(orderToDelete);

      const result = await service.deleteOrder(1, 1);

      expect(result).toEqual(orderToDelete);
      expect(mockPrismaService.order.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(mockPrismaService.order.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw an error if the user does not own the order', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.deleteOrder(1, 2)).rejects.toThrow(
        'Unauthorized: You do not own this order.'
      );
    });
  });
});
