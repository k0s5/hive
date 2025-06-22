import { Injectable } from '@nestjs/common'
import { ThrottlerStorageService } from '@nestjs/throttler'
import { RedisService } from './redis.service'

@Injectable()
export class RedisThrottlerService extends ThrottlerStorageService {
  constructor(private readonly redisService: RedisService) {
    super()
  }

  async getRecord(key: string): Promise<number[]> {
    const records = await this.redisService.get(`throttle:${key}`)
    return records || []
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    const now = Date.now()
    const throttleKey = `throttle:${key}`

    // Get existing records
    let records: number[] = (await this.getRecord(throttleKey)) || []

    // Remove expired records
    records = records.filter((timestamp) => now - timestamp < ttl * 1000)

    // Add new record
    records.push(now)

    // Store updated records with TTL
    await this.redisService.set(throttleKey, records, ttl)
  }
}
