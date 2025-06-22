// services/api-gateway/src/app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store'
import { configValidationSchema } from './config/config.validation'
import { AuthModule } from './modules/auth/auth.module'
import { RedisModule } from './modules/redis/redis.module'
import { ThrottlerConfigService } from './config/throttler.config'
// import { UsersModule } from './modules/users/users.module'
// import { ChatsModule } from './modules/chats/chats.module'
// import { NotificationsModule } from './modules/notifications/notifications.module'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: configValidationSchema,
    }),

    // Redis Module (must be imported before other modules that depend on it)
    RedisModule,

    // Rate limiting with Redis storage
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      useClass: ThrottlerConfigService,
    }),

    // Caching with Redis (for general caching - DB 1)
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_CACHE_DB || '1'), // Separate DB for caching
      ttl: 300, // 5 minutes default TTL
      max: 1000, // Maximum number of items in cache
    }),

    // Feature modules
    AuthModule,
    // UsersModule,
    // ChatsModule,
    // NotificationsModule,
    // HealthModule,
  ],
})
export class AppModule {}
