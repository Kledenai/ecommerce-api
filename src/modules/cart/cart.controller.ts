import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UpdateCartDto } from 'modules/cart/dtos/update-cart.dto';
import { AuthUserRequest } from 'modules/auth/auth-user-request';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { CartService } from 'modules/cart/cart.service';
import {
  Controller,
  UseGuards,
  Delete,
  Param,
  Body,
  Post,
  Get,
  Put,
  Req,
} from '@nestjs/common';

@Controller('carts')
@UseGuards(JwtAuthGuard)
@ApiTags('Cart')
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart', description: 'Creates a new cart for the authenticated user.' })
  @ApiResponse({ status: 201, description: 'Cart created successfully.' })
  async createCart(@Req() req: AuthUserRequest) {
    return this.cartService.createCart({ userId: req.user.id });
  }

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user\'s carts', description: 'Retrieves all carts of the authenticated user.' })
  @ApiResponse({ status: 200, description: 'Carts retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No carts found for the user.' })
  async getCartsByUser(@Req() req: AuthUserRequest) {
    return this.cartService.getCartByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific cart', description: 'Retrieves a cart by its ID if it belongs to the authenticated user.' })
  @ApiParam({ name: 'id', example: 1, description: 'Cart ID' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to access this cart.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async getCartById(@Req() req: AuthUserRequest, @Param('id') id: number) {
    return this.cartService.getCartById(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cart', description: 'Updates an item in the cart if it belongs to the authenticated user.' })
  @ApiParam({ name: 'id', example: 1, description: 'Cart ID' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'Cart updated successfully.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to update this cart.' })
  @ApiResponse({ status: 404, description: 'Cart not found or product not in cart.' })
  async updateCart(@Req() req: AuthUserRequest, @Param('id') id: number, @Body() body: UpdateCartDto) {
    return this.cartService.updateCart(id, req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific cart', description: 'Deletes a cart by its ID if it belongs to the authenticated user.' })
  @ApiParam({ name: 'id', example: 1, description: 'Cart ID' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to delete this cart.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async deleteCart(@Req() req: AuthUserRequest, @Param('id') id: number) {
    return this.cartService.deleteCart(id, req.user.id);
  }
}
