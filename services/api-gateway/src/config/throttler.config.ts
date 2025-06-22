import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ThrottlerOptionsFactory,
  ThrottlerModuleOptions,
} from '@nestjs/throttler'
import { RedisThrottlerService } from '../modules/redis/redis-throttler.service'

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(
    private configService: ConfigService,
    private redisThrottlerService: RedisThrottlerService
  ) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      throttlers: [
        {
          name: 'short',
          ttl: this.configService.get('THROTTLE_TTL', 60) * 1000, // Convert to ms
          limit: this.configService.get('THROTTLE_LIMIT', 100),
        },
        {
          name: 'medium',
          ttl: 60 * 60 * 1000, // 1 hour
          limit: 1000,
        },
        {
          name: 'long',
          ttl: 24 * 60 * 60 * 1000, // 24 hours
          limit: 10000,
        },
      ],
      storage: this.redisThrottlerService,
    }
  }
}
