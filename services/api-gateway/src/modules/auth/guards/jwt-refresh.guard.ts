import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { AuthGuard } from '@nestjs/passport'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  private readonly logger = new Logger(JwtRefreshGuard.name)

  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err) {
      this.logger.error('JWT refresh authentication error:', err.message)
      throw err
    }

    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Refresh token has expired')
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    if (info && info.message === 'No auth token') {
      throw new UnauthorizedException('Refresh token is required')
    }

    if (info && info.message === 'Refresh token has been revoked') {
      throw new UnauthorizedException('Refresh token has been revoked')
    }

    if (info && info.message === 'Refresh token not found or expired') {
      throw new UnauthorizedException(
        'Refresh token not found or expired in storage'
      )
    }

    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    return user
  }
}
