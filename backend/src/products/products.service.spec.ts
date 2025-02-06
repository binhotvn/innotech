import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/product.entity';
import { UtilService } from '../utils/utils.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { redisStore } from 'cache-manager-redis-yet';
describe('test produce service', () => {
  let service: ProductsService;

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

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should require price to be positive', () => {
    expect(
      service.create({
        name: 'Test Product',
        price: -10,
        description: 'Test Description',
        category: 'Test Category',
      }),
    ).toThrowError('Price must be positive');
  });

  it('should create product successfully with valid data', async () => {
    const product = await service.create({
      name: 'Test Product',
      price: 10,
      description: 'Test Description',
      category: 'Test Category',
    });
    expect(product).toBeDefined();
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(10);
    expect(product.description).toBe('Test Description');
  });
});
