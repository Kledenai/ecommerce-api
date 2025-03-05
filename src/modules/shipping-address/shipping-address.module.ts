import { ShippingAddressController } from 'modules/shipping-address/shipping-address.controller';
import { ShippingAddressService } from 'modules/shipping-address/shipping-address.service';
import { AuthModule } from 'modules/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ShippingAddressService],
  controllers: [ShippingAddressController],
  exports: [ShippingAddressService],
})
export class ShippingAddressModule {}
