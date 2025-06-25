import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { TokenPayload } from '@hive/shared'
import { JwtService } from '@nestjs/jwt'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { RedisService } from '../../redis/redis.service'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(req: any, payload: TokenPayload) {
    const refreshToken = req.body?.refreshToken

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided')
    }

    // Check if refresh token is blacklisted
    const isBlacklisted =
      await this.redisService.isTokenBlacklisted(refreshToken)
    if (isBlacklisted) {
      throw new UnauthorizedException('Refresh token has been revoked')
    }

    if (!payload.userId) {
      throw new UnauthorizedException('Invalid refresh token payload')
    }

    // Extract token ID from JWT payload (jti claim)
    const tokenId = payload.jti || payload.sub
    if (!tokenId) {
      throw new UnauthorizedException('Invalid refresh token: missing token ID')
    }

    // Verify refresh token exists in Redis
    const isValidRefreshToken = await this.redisService.isRefreshTokenValid(
      payload.userId,
      tokenId
    )

    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Refresh token is expired')
    }

    return {
      userId: payload.userId,
      refreshToken,
      tokenId,
    }
  }
}
