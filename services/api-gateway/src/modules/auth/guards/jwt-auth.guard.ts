import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name)

  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Enhanced error handling for different JWT scenarios
    if (err) {
      this.logger.error('JWT authentication error:', err.message)
      throw err
    }

    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Access token has expired')
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid access token')
    }

    if (info && info.message === 'No auth token') {
      throw new UnauthorizedException('Access token is required')
    }

    if (info && info.message === 'Token has been revoked') {
      throw new UnauthorizedException('Access token has been revoked')
    }

    if (!user) {
      throw new UnauthorizedException('Invalid or expired access token')
    }

    return user
  }
}
