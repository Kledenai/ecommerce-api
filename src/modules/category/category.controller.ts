import { CreateCategoryDto } from 'modules/category/dtos/create-category.dto';
import { UpdateCategoryDto } from 'modules/category/dtos/update-category.dto';
import { CategoryService } from 'modules/category/category.service';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  UseGuards,
  Delete,
  Param,
  Post,
  Body,
  Get,
  Put,
} from '@nestjs/common';

@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiTags('Categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async createCategory(@Body() body: CreateCategoryDto) {
    return this.categoryService.createCategory(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully.' })
  async getCategories() {
    return this.categoryService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async getCategoryById(@Param('id') id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async updateCategory(@Param('id') id: number, @Body() body: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found or cannot be deleted.' })
  async deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
