import { Module } from '@nestjs/common';
import { ShopModule } from './shop/shop.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ShopModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
