import { ShippingAddressService } from 'modules/shipping-address/shipping-address.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';

const mockPrismaService = {
  shippingAddress: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ShippingAddressService', () => {
  let service: ShippingAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingAddressService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ShippingAddressService>(ShippingAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createShippingAddress', () => {
    it('should create a shipping address', async () => {
      const userId = 1;
      const shippingAddressData = {
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Anytown',
        state: 'CA',
        country: 'USA',
        postalCode: '12345',
      };

      const expectedResponse = { id: 1, userId, ...shippingAddressData };

      mockPrismaService.shippingAddress.create.mockResolvedValue(expectedResponse);

      const result = await service.createShippingAddress(userId, shippingAddressData);

      expect(result).toEqual(expectedResponse);
      expect(mockPrismaService.shippingAddress.create).toHaveBeenCalledWith({
        data: { userId, ...shippingAddressData },
      });
    });
  });

  describe('getShippingAddresses', () => {
    it('should return a list of shipping addresses for the user', async () => {
      const userId = 1;
      const shippingAddresses = [
        { id: 1, userId, fullName: 'John Doe', addressLine1: '123 Main St', city: 'Anytown', state: 'CA', country: 'USA', postalCode: '12345' },
        { id: 2, userId, fullName: 'Jane Doe', addressLine1: '456 Another St', city: 'Othertown', state: 'NY', country: 'USA', postalCode: '67890' },
      ];

      mockPrismaService.shippingAddress.findMany.mockResolvedValue(shippingAddresses);

      const result = await service.getShippingAddresses(userId);

      expect(result).toEqual(shippingAddresses);
      expect(mockPrismaService.shippingAddress.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('updateShippingAddress', () => {
    it('should update a shipping address if the user owns it', async () => {
      const userId = 1;
      const addressId = 1;
      const updatedData = {
        fullName: 'Jane Doe',
        addressLine1: '456 New St',
        addressLine2: 'Suite 200',
        city: 'Othertown',
        state: 'NY',
        country: 'USA',
        postalCode: '67890',
      };

      const updatedAddress = { id: addressId, userId, ...updatedData };

      mockPrismaService.shippingAddress.findFirst.mockResolvedValue(updatedAddress);
      mockPrismaService.shippingAddress.update.mockResolvedValue(updatedAddress);

      const result = await service.updateShippingAddress(userId, addressId, updatedData);

      expect(result).toEqual(updatedAddress);
      expect(mockPrismaService.shippingAddress.findFirst).toHaveBeenCalledWith({
        where: { id: addressId, userId },
      });
      expect(mockPrismaService.shippingAddress.update).toHaveBeenCalledWith({
        where: { id: addressId },
        data: updatedData,
      });
    });

    it('should throw an error if the user does not own the shipping address', async () => {
      mockPrismaService.shippingAddress.findFirst.mockResolvedValue(null);

      await expect(service.updateShippingAddress(1, 2, { fullName: 'Jane Doe' })).rejects.toThrow(
        'Unauthorized: You do not own this shipping address.'
      );
    });
  });

  describe('deleteShippingAddress', () => {
    it('should delete a shipping address if the user owns it', async () => {
      const userId = 1;
      const addressId = 1;
      const shippingAddressToDelete = { id: addressId, userId };

      mockPrismaService.shippingAddress.findFirst.mockResolvedValue(shippingAddressToDelete);
      mockPrismaService.shippingAddress.delete.mockResolvedValue(shippingAddressToDelete);

      const result = await service.deleteShippingAddress(userId, addressId);

      expect(result).toEqual(shippingAddressToDelete);
      expect(mockPrismaService.shippingAddress.findFirst).toHaveBeenCalledWith({
        where: { id: addressId, userId },
      });
      expect(mockPrismaService.shippingAddress.delete).toHaveBeenCalledWith({
        where: { id: addressId },
      });
    });

    it('should throw an error if the user does not own the shipping address', async () => {
      mockPrismaService.shippingAddress.findFirst.mockResolvedValue(null);

      await expect(service.deleteShippingAddress(1, 2)).rejects.toThrow(
        'Unauthorized: You do not own this shipping address.'
      );
    });
  });
});
