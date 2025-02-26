import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductService } from 'modules/product/product.service';
import { ProductController } from 'modules/product/product.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
