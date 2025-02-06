import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/product.entity';
import { UtilService } from '../utils/utils.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { redisStore } from 'cache-manager-redis-yet';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot(),
        CacheModule.registerAsync({
          useFactory: async () => {
            const store = await redisStore({
              socket: {
                host: process.env.REDIS_SERVER,
                port: parseInt(process.env.REDIS_PORT || '6379', 10),
              },
            });

            return {
              store: store as unknown as CacheStore,
              ttl: 3 * 6000000000, // 3 minutes (milliseconds)
            };
          },
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        MongooseModule.forFeature([
          { name: 'products', schema: ProductSchema, collection: 'products' },
        ]),
        CacheModule.register(),
      ],

      providers: [UtilService, ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('product controller be defined', () => {
    expect(controller).toBeDefined();
  });
});
