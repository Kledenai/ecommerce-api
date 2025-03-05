import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'modules/user/dtos/create-user.dto';
import { UpdateUserDto } from 'modules/user/dtos/update-user.dto';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { UserService } from 'modules/user/user.service';
import {
  ParseIntPipe,
  Controller,
  UseGuards,
  Delete,
  Param,
  Post,
  Body,
  Get,
  Put,
} from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.createUser(body);
    return { message: 'User created successfully', user };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
