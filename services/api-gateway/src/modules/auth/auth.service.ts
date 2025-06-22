import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { RedisService } from '../redis/redis.service'
import { firstValueFrom } from 'rxjs'
import { SignupDto } from './dto/signup.dto'
import { SigninDto } from './dto/signin.dto'
import { API_ROUTES, TokenPayload, AuthTokens } from '@hive/shared'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly authServiceUrl: string

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService
  ) {
    this.authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') || ''
  }

  async signup(signupDto: SignupDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}${API_ROUTES.AUTH.SIGNUP}`,
          signupDto
        )
      )

      const user = response.data
      const tokens = await this.generateTokens(user)

      // Store refresh token in Redis
      const refreshTokenPayload = this.jwtService.decode(
        tokens.refreshToken
      ) as any
      const tokenId = refreshTokenPayload.jti
      const refreshExpiresIn = this.getTokenExpirationTime(
        'JWT_REFRESH_EXPIRES_IN'
      )

      await this.redisService.storeRefreshToken(
        user.id,
        tokenId,
        refreshExpiresIn
      )

      return {
        success: true,
        data: {
          user,
          ...tokens,
        },
      }
    } catch (error) {
      this.logger.error('Signup failed', error.response?.data || error.message)
      throw error
    }
  }

  async signin(signinDto: SigninDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}${API_ROUTES.AUTH.SIGNIN}`,
          signinDto
        )
      )

      const user = response.data
      const tokens = await this.generateTokens(user)

      // Store refresh token in Redis
      const refreshTokenPayload = this.jwtService.decode(
        tokens.refreshToken
      ) as any
      const tokenId = refreshTokenPayload.jti
      const refreshExpiresIn = this.getTokenExpirationTime(
        'JWT_REFRESH_EXPIRES_IN'
      )

      await this.redisService.storeRefreshToken(
        user.id,
        tokenId,
        refreshExpiresIn
      )

      // Cache user data
      await this.redisService.cacheUser(
        user.id,
        user,
        this.configService.get<number>('USER_CACHE_EXPIRES_IN')
      )

      return {
        success: true,
        data: {
          user,
          ...tokens,
        },
      }
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Invalid credentials')
      } else if (error.response?.status === 404) {
        throw new UnauthorizedException('User not found. Please sign up first')
      } else {
        this.logger.error(
          'Signin failed',
          error.response?.data || error.message
        )
        throw new UnauthorizedException('Invalid credentials')
      }
    }
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
    tokenId: string
  ): Promise<AuthTokens> {
    try {
      // Verify refresh token exists in Redis
      const isValidRefreshToken = await this.redisService.isRefreshTokenValid(
        userId,
        tokenId
      )

      if (!isValidRefreshToken) {
        throw new UnauthorizedException('Refresh token not found or expired')
      }

      // Revoke old refresh token
      await this.redisService.revokeRefreshToken(userId, tokenId)

      // Get user data from cache or auth service
      let user = await this.redisService.getCachedUser(userId)
      if (!user) {
        const response = await firstValueFrom(
          this.httpService.get(
            `${this.authServiceUrl}${API_ROUTES.AUTH.ME}/${userId}`
          )
        )
        user = response.data
        await this.redisService.cacheUser(
          userId,
          user,
          this.configService.get<number>('USER_CHACHE_EXPIRES_IN')
        )
      }

      // Generate new tokens
      const newTokens = await this.generateTokens(user)

      // Store new refresh token in Redis
      const newRefreshTokenPayload = this.jwtService.decode(
        newTokens.refreshToken
      ) as any
      const newTokenId = newRefreshTokenPayload.jti
      const refreshExpiresIn = this.getTokenExpirationTime(
        'JWT_REFRESH_EXPIRES_IN'
      )

      await this.redisService.storeRefreshToken(
        userId,
        newTokenId,
        refreshExpiresIn
      )

      return newTokens
    } catch (error) {
      this.logger.error('Token refresh failed', error.message)
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async signout(userId: string, token?: string) {
    try {
      // Blacklist current access token if provided
      if (token) {
        const tokenPayload = this.jwtService.decode(token) as any
        const expiresIn = tokenPayload.exp - Math.floor(Date.now() / 1000)
        if (expiresIn > 0) {
          await this.redisService.blacklistToken(token, expiresIn)
        }
      }

      // Revoke all refresh tokens for user
      await this.redisService.revokeAllRefreshTokens(userId)

      // Clear user cache
      await this.redisService.invalidateUserCache(userId)

      return {
        success: true,
        message: 'Successfully signed out',
      }
    } catch (error) {
      this.logger.error('Signout failed', error.message)
      throw error
    }
  }

  async getProfile(userId: string) {
    try {
      // Try cache first
      let user = await this.redisService.getCachedUser(userId)

      if (!user) {
        const response = await firstValueFrom(
          this.httpService.get(`${this.authServiceUrl}/users/${userId}`)
        )
        user = response.data
        await this.redisService.cacheUser(
          userId,
          user,
          this.configService.get<number>('USER_CACHE_EXPIRES_IN')
        )
      }

      return {
        success: true,
        data: user,
      }
    } catch (error) {
      this.logger.error(
        'Get profile failed',
        error.response?.data || error.message
      )
      throw error
    }
  }

  //#region For inner usage
  async validateUser(payload: TokenPayload) {
    try {
      // Try cache first
      let user = await this.redisService.getCachedUser(payload.userId)

      if (!user) {
        const response = await firstValueFrom(
          this.httpService.get(
            `${this.authServiceUrl}${API_ROUTES.AUTH.ME}/${payload.userId}`
          )
        )
        user = response.data

        // Cache user
        await this.redisService.cacheUser(
          payload.userId,
          user,
          this.configService.get<number>('USER_CACHE_EXPIRES_IN')
        )
      }

      return user
    } catch (error) {
      this.logger.error('User validation failed', error.message)
      return null
    }
  }

  private async generateTokens(user: any): Promise<AuthTokens> {
    const tokenId = uuidv4()

    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      ...(user && { username: user.username }),
    }

    const accessTokenPayload = {
      ...payload,
      jti: tokenId,
    }

    const refreshTokenPayload = {
      ...payload,
      jti: tokenId,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  private getTokenExpirationTime(configKey: string): number {
    const expiresIn = this.configService.get<string>(configKey)

    // Convert JWT expiration format to seconds
    if (expiresIn?.endsWith('d')) {
      return parseInt(expiresIn) * 24 * 60 * 60
    } else if (expiresIn?.endsWith('h')) {
      return parseInt(expiresIn) * 60 * 60
    } else if (expiresIn?.endsWith('m')) {
      return parseInt(expiresIn) * 60
    } else if (expiresIn?.endsWith('s')) {
      return parseInt(expiresIn)
    } else {
      // Default to seconds
      return parseInt(expiresIn || '0')
    }
  }
  //#endregion For inner usage
}
