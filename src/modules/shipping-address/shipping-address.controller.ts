import { Controller, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ShippingAddressService } from 'modules/shipping-address/shipping-address.service';

@Controller('shipping-addresses')
export class ShippingAddressController {
  constructor(private readonly shippingAddressService: ShippingAddressService) {}

  @Post()
  async createShippingAddress(@Body() body: {
    userId: number;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) {
    return this.shippingAddressService.createShippingAddress(body);
  }

  @Put(':id')
  async updateShippingAddress(
    @Param('id') id: number,
    @Body() body: {
      fullName?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    },
  ) {
    return this.shippingAddressService.updateShippingAddress(id, body);
  }

  @Delete(':id')
  async deleteShippingAddress(@Param('id') id: number) {
    return this.shippingAddressService.deleteShippingAddress(id);
  }
}
