import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store'
import { configValidationSchema } from './config/config.validation'
import { AuthModule } from './modules/auth'
// import { UsersModule } from './modules/users/users.module'
// import { ChatsModule } from './modules/chats/chats.module'
// import { NotificationsModule } from './modules/notifications/notifications.module'
// import { HealthModule } from './modules/health/health.module'
import { ThrottlerConfigService } from './config/throttler.config'

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: configValidationSchema,
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useClass: ThrottlerConfigService,
    }),

    // Caching with Redis
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      ttl: 300, // 5 minutes default TTL
    }),
    AuthModule,
  ],
})
export class AppModule {}
