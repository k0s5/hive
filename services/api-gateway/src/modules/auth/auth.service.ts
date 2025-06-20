import {
  Injectable,
  UnauthorizedException,
  BadGatewayException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { SigninDto, SignupDto } from './dto'
import { API_ROUTES, type AuthTokens, type TokenPayload } from '@hive/shared'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly authServiceUrl: string

  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL')!
  }

  async signup(signupDto: SignupDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}${API_ROUTES.AUTH.SIGNUP}`,
          signupDto
        )
      )

      const { user } = response.data
      const tokens = await this.generateTokens(user)

      return {
        success: true,
        data: {
          user,
          tokens,
        },
      }
    } catch (error) {
      this.logger.error('Signup failed', error.response?.data || error.message)
      throw error
    }
  }

  async signin(signinDto: SigninDto) {
    try {
      // return {
      //   success: true,
      //   data: {
      //     user: { id: 1, email: 'a@a.ru', username: 'aaa' },
      //     tokens: {
      //       accessToken: 'aaaa',
      //       refreshToken: 'bbbbb',
      //     },
      //   },
      // }
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}${API_ROUTES.AUTH.SIGNIN}`,
          signinDto
        )
      )

      const { user } = response.data
      const tokens = await this.generateTokens(user)

      return {
        success: true,
        data: {
          user,
          tokens,
        },
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        this.logger.error('Server is not respond')
        throw new BadGatewayException('Server is not respond')
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
    refreshToken: string
  ): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }) as TokenPayload

      if (payload.userId !== userId) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      // Get user data from auth service
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}${API_ROUTES.AUTH.ME}`)
      )

      const user = response.data
      return await this.generateTokens(user)
    } catch (error) {
      this.logger.error('Token refresh failed', error.message)
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async signout(userId: string) {
    try {
      // Here you could implement token blacklisting
      // For now, just return success
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
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/users/${userId}`)
      )

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      this.logger.error(
        'Get profile failed',
        error.response?.data || error.message
      )
      throw error
    }
  }

  async validateUser(payload: TokenPayload) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/users/${payload.userId}`)
      )

      return response.data
    } catch (error) {
      this.logger.error('User validation failed', error.message)
      return null
    }
  }

  private async generateTokens(user: any): Promise<AuthTokens> {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      username: user.username,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
