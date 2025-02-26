import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'modules/auth/auth.module';
import { ProductService } from 'modules/product/product.service';
import { ProductController } from 'modules/product/product.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
