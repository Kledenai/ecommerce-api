import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { OrderService } from 'modules/order/order.service';

const mockPrismaService = {
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  orderItem: {
    createMany: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
  },
  cart: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
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
    it('should update the order status', async () => {
      const updatedOrder = { id: 1, userId: 1, status: 'SHIPPED' };

      mockPrismaService.order.update.mockResolvedValue(updatedOrder);

      const result = await service.updateOrder(1, { status: 'SHIPPED' });

      expect(result).toEqual(updatedOrder);
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'SHIPPED' },
      });
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      const orderToDelete = { id: 1, userId: 1, status: 'PENDING' };

      mockPrismaService.order.delete.mockResolvedValue(orderToDelete);

      const result = await service.deleteOrder(1);

      expect(result).toEqual(orderToDelete);
      expect(mockPrismaService.order.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});