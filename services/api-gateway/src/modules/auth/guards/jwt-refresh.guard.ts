import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Дополнительная логика перед проверкой токена
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any, info: any) {
    // Кастомная обработка результата аутентификации
    if (err || !user) {
      throw new UnauthorizedException(`${info}`)
    }
    return user
  }
}
