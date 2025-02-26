import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { ShippingAddressService } from 'modules/shipping-address/shipping-address.service';

const mockPrismaService = {
  shippingAddress: {
    create: jest.fn(),
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
      const shippingAddressData = {
        userId: 1,
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Anytown',
        state: 'CA',
        country: 'USA',
        postalCode: '12345',
      };

      mockPrismaService.shippingAddress.create.mockResolvedValue(shippingAddressData);

      const result = await service.createShippingAddress(shippingAddressData);

      expect(result).toEqual(shippingAddressData);
      expect(mockPrismaService.shippingAddress.create).toHaveBeenCalledWith({
        data: shippingAddressData,
      });
    });
  });

  describe('updateShippingAddress', () => {
    it('should update a shipping address', async () => {
      const updatedShippingAddress = {
        id: 1,
        fullName: 'Jane Doe',
        addressLine1: '456 New St',
        addressLine2: 'Suite 200',
        city: 'Othertown',
        state: 'NY',
        country: 'USA',
        postalCode: '67890',
      };

      mockPrismaService.shippingAddress.update.mockResolvedValue(updatedShippingAddress);

      const result = await service.updateShippingAddress(1, {
        fullName: 'Jane Doe',
        addressLine1: '456 New St',
        addressLine2: 'Suite 200',
        city: 'Othertown',
        state: 'NY',
        country: 'USA',
        postalCode: '67890',
      });

      expect(result).toEqual(updatedShippingAddress);
      expect(mockPrismaService.shippingAddress.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          fullName: 'Jane Doe',
          addressLine1: '456 New St',
          addressLine2: 'Suite 200',
          city: 'Othertown',
          state: 'NY',
          country: 'USA',
          postalCode: '67890',
        },
      });
    });
  });

  describe('deleteShippingAddress', () => {
    it('should delete a shipping address', async () => {
      const shippingAddressToDelete = {
        id: 1,
        userId: 1,
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Anytown',
        state: 'CA',
        country: 'USA',
        postalCode: '12345',
      };

      mockPrismaService.shippingAddress.delete.mockResolvedValue(shippingAddressToDelete);

      const result = await service.deleteShippingAddress(1);

      expect(result).toEqual(shippingAddressToDelete);
      expect(mockPrismaService.shippingAddress.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
