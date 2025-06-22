// services/api-gateway/src/modules/redis/redis.service.ts
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name)
  private readonly redis: Redis

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASS'),
      db: this.configService.get<number>('REDIS_DB', 0),
      retryStrategy: () => 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis successfully')
    })

    this.redis.on('error', (err) => {
      this.logger.error('Redis connection error:', err)
    })
  }

  async onModuleDestroy() {
    await this.redis.quit()
  }

  // Token blacklist methods
  async blacklistToken(
    token: string,
    expireTimeInSeconds: number
  ): Promise<void> {
    const key = `blacklist:${token}`
    await this.redis.setex(key, expireTimeInSeconds, '1')
    this.logger.debug(`Token blacklisted: ${key}`)
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`
    const result = await this.redis.get(key)
    return result === '1'
  }

  // Rate limiting methods
  async incrementRateLimit(key: string, windowMs: number): Promise<number> {
    const count = await this.redis.incr(key)
    if (count === 1) {
      await this.redis.pexpire(key, windowMs)
    }
    return count
  }

  async getRateLimit(key: string): Promise<number> {
    const count = await this.redis.get(key)
    return parseInt(count || '0', 10)
  }

  async resetRateLimit(key: string): Promise<void> {
    await this.redis.del(key)
  }

  // User cache methods
  async cacheUser(
    userId: string,
    userData: any,
    ttlInSeconds: number = 300
  ): Promise<void> {
    const key = `user:${userId}`
    await this.redis.setex(key, ttlInSeconds, JSON.stringify(userData))
  }

  async getCachedUser(userId: string): Promise<any | null> {
    const key = `user:${userId}`
    const data = await this.redis.get(key)
    return data ? JSON.parse(data) : null
  }

  async invalidateUserCache(userId: string): Promise<void> {
    const key = `user:${userId}`
    await this.redis.del(key)
  }

  // Refresh token methods
  async storeRefreshToken(
    userId: string,
    tokenId: string,
    expireTimeInSeconds: number
  ): Promise<void> {
    const key = `refresh_token:${userId}:${tokenId}`
    await this.redis.setex(key, expireTimeInSeconds, '1')
  }

  async isRefreshTokenValid(userId: string, tokenId: string): Promise<boolean> {
    const key = `refresh_token:${userId}:${tokenId}`
    const result = await this.redis.get(key)
    return result === '1'
  }

  async revokeRefreshToken(userId: string, tokenId: string): Promise<void> {
    const key = `refresh_token:${userId}:${tokenId}`
    await this.redis.del(key)
  }

  async revokeAllRefreshTokens(userId: string): Promise<void> {
    const pattern = `refresh_token:${userId}:*`
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }

  // Session management
  async createSession(
    userId: string,
    sessionId: string,
    ttlInSeconds: number
  ): Promise<void> {
    const key = `session:${sessionId}`
    await this.redis.setex(key, ttlInSeconds, userId)
  }

  async getSession(sessionId: string): Promise<string | null> {
    const key = `session:${sessionId}`
    return await this.redis.get(key)
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`
    await this.redis.del(key)
  }

  // Generic cache methods
  async set(key: string, value: any, ttlInSeconds?: number): Promise<void> {
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value)
    if (ttlInSeconds) {
      await this.redis.setex(key, ttlInSeconds, stringValue)
    } else {
      await this.redis.set(key, stringValue)
    }
  }

  async get(key: string): Promise<any> {
    const value = await this.redis.get(key)
    if (!value) return null

    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key)
    return result === 1
  }

  async expire(key: string, ttlInSeconds: number): Promise<void> {
    await this.redis.expire(key, ttlInSeconds)
  }

  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key)
  }
}
