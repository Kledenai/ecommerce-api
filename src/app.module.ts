import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from 'modules/product/product.module';
import { CategoryModule } from 'modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [PrismaModule, ProductModule, UserModule, CategoryModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
