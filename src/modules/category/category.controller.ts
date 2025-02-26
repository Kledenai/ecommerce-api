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
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { CategoryService } from 'modules/category/category.service';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() body: { name: string }) {
    return this.categoryService.createCategory(body);
  }

  @Get()
  async getCategories() {
    return this.categoryService.getCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() body: { name?: string },
  ) {
    return this.categoryService.updateCategory(id, body);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
