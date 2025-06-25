import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpStatus,
  Delete,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { SignupDto } from './dto/signup.dto'
import { SigninDto } from './dto/signin.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { API_ROUTES } from '@hive/shared'

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*#region SIGNUP*/
  @Post(API_ROUTES.AUTH.SIGNUP)
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists',
  })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto)
  }
  /*#endregion SIGNUP*/

  /*#region SIGNIN*/
  @Post(API_ROUTES.AUTH.SIGNIN)
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully signed in',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto)
  }
  /*#endregion SIGNIN*/

  /*#region REFRESH*/
  @Post(API_ROUTES.AUTH.REFRESH)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token successfully refreshed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid refresh token',
  })
  async refreshToken(@Request() req, @Body() refreshTokenDto: RefreshTokenDto) {
    const { userId, refreshToken, tokenId } = req.user

    const res = await this.authService.refreshTokens(
      userId,
      refreshToken,
      tokenId
    )

    return {
      user: res.user,
      tokens: res.tokens,
    }
  }
  /*#endregion REFRESH*/

  /*#region SIGNOUT*/
  @Delete(API_ROUTES.AUTH.SIGNOUT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully signed out',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid token',
  })
  async signout(@Request() req) {
    const user = req.user
    const token = user.currentToken

    return this.authService.signout(user.id, token)
  }
  /*#endregion SIGNOUT*/

  /*#region ME*/
  @Get(API_ROUTES.AUTH.ME)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid token',
  })
  async getProfile(@Request() req) {
    return {
      success: true,
      data: req.user,
    }
    //return this.authService.getProfile(req.user.id)
  }
  /*#endregion ME*/
}
