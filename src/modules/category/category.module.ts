import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'modules/auth/auth.module';
import { CategoryService } from 'modules/category/category.service';
import { CategoryController } from 'modules/category/category.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
