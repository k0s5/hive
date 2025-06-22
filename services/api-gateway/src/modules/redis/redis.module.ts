import { Module, Global } from '@nestjs/common'
import { RedisService } from './redis.service'
import { RedisThrottlerService } from './redis-throttler.service'

@Global()
@Module({
  providers: [RedisService, RedisThrottlerService],
  exports: [RedisService, RedisThrottlerService],
})
export class RedisModule {}
