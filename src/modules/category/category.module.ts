import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CategoryService } from 'modules/category/category.service';
import { CategoryController } from 'modules/category/category.controller';

@Module({
  imports: [PrismaModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
