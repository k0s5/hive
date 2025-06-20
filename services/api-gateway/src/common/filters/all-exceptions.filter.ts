import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status: number
    let message: string
    let error: string

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const responseBody = exception.getResponse()

      if (typeof responseBody === 'string') {
        message = responseBody
        error = exception.name
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const body = responseBody as any
        message = body.message || exception.message
        error = body.error || exception.name
      } else {
        message = exception.message
        error = exception.name
      }
    } else if (exception instanceof Error) {
      if (
        exception.name === 'AggregateError' &&
        //@ts-ignore
        exception.errors[0].code === 'ECONNREFUSED'
      ) {
        status = HttpStatus.BAD_GATEWAY
        message = 'Bad Gateway'
        error = 'Server is not respond'

        // Log the full error for debugging
        this.logger.error(
          //@ts-ignore
          `Server is not respond`,
          //@ts-ignore
          `${exception.errors[0].address}`,
          //@ts-ignore
          `${exception.errors[0].port}`,
          `${request.method} ${request.url}`
        )
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR
        message = 'Internal server error'
        error = exception.name

        // Log the full error for debugging
        this.logger.error(
          `Unhandled exception: ${exception.message}`,
          exception.stack,
          `${request.method} ${request.url}`
        )
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'
      error = 'UnknownError'

      this.logger.error(
        `Unknown exception type: ${exception}`,
        undefined,
        `${request.method} ${request.url}`
      )
    }

    // Log the exception
    // this.logger.error(
    //   `${request.method} ${request.url} - ${status} - ${message}`,
    //   exception instanceof Error ? exception.stack : undefined
    // )

    // Send error response
    response.status(status).json({
      success: false,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    })
  }
}
