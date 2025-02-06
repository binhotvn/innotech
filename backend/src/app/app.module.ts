import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { redisStore } from 'cache-manager-redis-yet';
import { ProductsModule } from '../products/products.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 30000,
        limit: 3000,
      },
    ]),
    ConfigModule.forRoot(),
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
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}
