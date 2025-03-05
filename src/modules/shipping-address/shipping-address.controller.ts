import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateShippingAddressDto } from 'modules/shipping-address/dtos/create-shipping-address.dto';
import { UpdateShippingAddressDto } from 'modules/shipping-address/dtos/update-shipping-address.dto';
import { Controller, Post, Body, Param, Put, Delete, UseGuards, Req, Get } from '@nestjs/common';
import { ShippingAddressService } from 'modules/shipping-address/shipping-address.service';
import { AuthUserRequest } from 'modules/auth/auth-user-request';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';

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
  async createShippingAddress(@Req() req: AuthUserRequest, @Body() body: CreateShippingAddressDto) {
    return this.shippingAddressService.createShippingAddress(req.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipping addresses for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Shipping addresses retrieved successfully.' })
  async getShippingAddresses(@Req() req: AuthUserRequest) {
    return this.shippingAddressService.getShippingAddresses(req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a shipping address' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiBody({ type: UpdateShippingAddressDto })
  @ApiResponse({ status: 200, description: 'Shipping address updated successfully.' })
  @ApiResponse({ status: 403, description: 'Unauthorized: You do not own this shipping address.' })
  @ApiResponse({ status: 404, description: 'Shipping address not found.' })
  async updateShippingAddress(@Req() req: AuthUserRequest, @Param('id') id: number, @Body() body: UpdateShippingAddressDto) {
    return this.shippingAddressService.updateShippingAddress(req.user.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipping address' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Shipping address deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Unauthorized: You do not own this shipping address.' })
  @ApiResponse({ status: 404, description: 'Shipping address not found.' })
  async deleteShippingAddress(@Req() req: AuthUserRequest, @Param('id') id: number) {
    return this.shippingAddressService.deleteShippingAddress(req.user.id, id);
  }
}
