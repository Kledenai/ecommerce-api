import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'modules/auth/auth.module';
import { ShippingAddressService } from 'modules/shipping-address/shipping-address.service';
import { ShippingAddressController } from 'modules/shipping-address/shipping-address.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ShippingAddressService],
  controllers: [ShippingAddressController],
})
export class ShippingAddressModule {}
