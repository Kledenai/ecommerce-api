import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from 'modules/product/product.module';
import { CategoryModule } from 'modules/category/category.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { ShippingAddressModule } from './modules/shipping-address/shipping-address.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    CartModule,
    OrderModule,
    PrismaModule,
    ProductModule,
    CategoryModule,
    CartItemModule,
    OrderItemModule,
    ShippingAddressModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
