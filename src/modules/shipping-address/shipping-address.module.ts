import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ShippingAddressService } from 'modules/shipping-address/shipping-address.service';
import { ShippingAddressController } from 'modules/shipping-address/shipping-address.controller';

@Module({
  imports: [PrismaModule],
  providers: [ShippingAddressService],
  controllers: [ShippingAddressController],
})
export class ShippingAddressModule {}
