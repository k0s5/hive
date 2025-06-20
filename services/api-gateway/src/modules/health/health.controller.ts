import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus'
import { ConfigService } from '@nestjs/config'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private configService: ConfigService
  ) {}

  //#region CHECK
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health' })
  @ApiResponse({ status: 200, description: 'Health check passed' })
  @ApiResponse({ status: 503, description: 'Health check failed' })
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Check if microservices are healthy
      () =>
        this.http.pingCheck(
          'auth-service',
          `${this.configService.get('AUTH_SERVICE_URL')}/health`
        ),
      () =>
        this.http.pingCheck(
          'user-service',
          `${this.configService.get('USER_SERVICE_URL')}/health`
        ),
      () =>
        this.http.pingCheck(
          'chat-service',
          `${this.configService.get('CHAT_SERVICE_URL')}/health`
        ),
      () =>
        this.http.pingCheck(
          'notification-service',
          `${this.configService.get('NOTIFICATION_SERVICE_URL')}/health`
        ),
    ])
  }
  //#endregion CHECK

  //#region READY
  @Get('ready')
  @ApiOperation({ summary: 'Check if application is ready' })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  ready() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get('NODE_ENV'),
      version: process.env.npm_package_version || '1.0.0',
    }
  }
  //#endregion READY

  //#region LIVE
  @Get('live')
  @ApiOperation({ summary: 'Check if application is alive' })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  live() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  }
  //#endregion LIVE
}
