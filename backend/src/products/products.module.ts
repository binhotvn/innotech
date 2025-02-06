import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductSchema } from './entities/product.entity';
import { UtilService } from '../utils/utils.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'products', schema: ProductSchema, collection: 'products' },
    ]),
    CacheModule.register(),
  ],
  controllers: [ProductsController],
  providers: [UtilService, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
