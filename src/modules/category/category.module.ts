import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [PrismaModule], // Import PrismaModule para usar o PrismaService
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
