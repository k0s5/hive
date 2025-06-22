import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { RedisService } from '../../modules/redis/redis.service'

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenValidationMiddleware.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next()
      }

      const token = authHeader.substring(7)

      // Check if token is blacklisted
      const isBlacklisted = await this.redisService.isTokenBlacklisted(token)
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked')
      }

      // Verify token signature and expiration
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        })

        // Add token info to request for later use
        req['tokenInfo'] = {
          token,
          payload,
          isValid: true,
        }
      } catch (jwtError) {
        // Token is invalid or expired, but don't throw error here
        // Let the guard handle it properly
        req['tokenInfo'] = {
          token,
          payload: null,
          isValid: false,
          error: jwtError.message,
        }
      }

      next()
    } catch (error) {
      this.logger.error('Token validation middleware error:', error.message)
      next(error)
    }
  }
}
