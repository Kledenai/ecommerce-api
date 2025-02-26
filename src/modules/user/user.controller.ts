import {
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { UserService } from 'modules/user/user.service';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
    },
  ) {
    return this.userService.createUser(body);
  }

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() body: { email?: string; password?: string; name?: string },
  ) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
