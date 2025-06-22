import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'
import { RedisService } from '../../redis/redis.service'
import { TokenPayload } from '@hive/shared'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true, // Enable access to request object to get the token
    })
  }

  async validate(req: any, payload: TokenPayload) {
    // Extract the token from the authorization header
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)

    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    // Check if token is blacklisted
    const isBlacklisted = await this.redisService.isTokenBlacklisted(token)
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked')
    }

    // Validate token payload
    if (!payload.userId) {
      throw new UnauthorizedException('Invalid token payload')
    }

    // Check if user exists in cache first
    // let user = await this.redisService.getCachedUser(payload.userId)

    // if (!user) {
    //   // If not in cache, validate user through auth service
    //   user = await this.authService.validateUser(payload)

    //   if (!user) {
    //     throw new UnauthorizedException('User not found or token invalid')
    //   }

    //   // Cache user for 5 minutes
    //   await this.redisService.cacheUser(payload.userId, user, 300)
    // }
    const user = await this.authService.validateUser(payload)

    // Attach token to user object for potential blacklisting
    user.currentToken = token

    return user
  }
}
