import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request, Response } from 'express'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    const { method, url, body, query, params } = request
    const userAgent = request.get('user-agent') || ''
    const ip = request.ip || request.connection.remoteAddress

    const startTime = Date.now()

    // Log request
    this.logger.log(`Incoming Request: ${method} ${url} - ${ip} - ${userAgent}`)

    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`)
      this.logger.debug(`Request Query: ${JSON.stringify(query)}`)
      this.logger.debug(`Request Params: ${JSON.stringify(params)}`)
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now()
          const duration = endTime - startTime

          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${response.statusCode} - ${duration}ms`
          )

          if (process.env.NODE_ENV === 'development') {
            this.logger.debug(`Response Data: ${JSON.stringify(data)}`)
          }
        },
        error: (error) => {
          const endTime = Date.now()
          const duration = endTime - startTime

          this.logger.error(
            `Request Error: ${method} ${url} - ${response.statusCode} - ${duration}ms`,
            error.stack
          )
        },
      })
    )
  }
}
