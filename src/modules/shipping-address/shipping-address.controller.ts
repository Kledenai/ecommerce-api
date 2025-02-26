import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { Controller, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ShippingAddressService } from 'modules/shipping-address/shipping-address.service';
import { CreateShippingAddressDto } from 'modules/shipping-address/dtos/create-shipping-address.dto';
import { UpdateShippingAddressDto } from 'modules/shipping-address/dtos/update-shipping-address.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('shipping-addresses')
@UseGuards(JwtAuthGuard)  
@ApiTags('Shipping Addresses')
@ApiBearerAuth()
export class ShippingAddressController {
  constructor(private readonly shippingAddressService: ShippingAddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a shipping address' })
  @ApiBody({ type: CreateShippingAddressDto })
  @ApiResponse({ status: 201, description: 'Shipping address created successfully.' })
  async createShippingAddress(@Body() body: CreateShippingAddressDto) {
    return this.shippingAddressService.createShippingAddress(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a shipping address' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiBody({ type: UpdateShippingAddressDto })
  @ApiResponse({ status: 200, description: 'Shipping address updated successfully.' })
  @ApiResponse({ status: 404, description: 'Shipping address not found.' })
  async updateShippingAddress(@Param('id') id: number, @Body() body: UpdateShippingAddressDto) {
    return this.shippingAddressService.updateShippingAddress(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipping address' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Shipping address deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Shipping address not found.' })
  async deleteShippingAddress(@Param('id') id: number) {
    return this.shippingAddressService.deleteShippingAddress(id);
  }
}
