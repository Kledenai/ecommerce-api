import { CategoryController } from 'modules/category/category.controller';
import { CategoryService } from 'modules/category/category.service';
import { AuthModule } from 'modules/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
