import { ProductController } from 'modules/product/product.controller';
import { ProductService } from 'modules/product/product.service';
import { StorageModule } from '../storage/storage.module';
import { AuthModule } from 'modules/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule, StorageModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
