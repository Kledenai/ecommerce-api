import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductModule } from 'modules/product/product.module';
import { ProductService } from 'modules/product/product.service';

@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ProductService],
})
export class AppModule {}
