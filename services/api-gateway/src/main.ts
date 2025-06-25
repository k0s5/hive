import { NestFactory } from '@nestjs/core'
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { setupSwagger } from './config/swagger.config'
import {
  AllExceptionsFilter,
  ValidationExceptionFilter,
} from './common/filters'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Global configuration
  app.setGlobalPrefix('api/v1')

  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    credentials: true,
  })

  // Global pipes
  app.useGlobalPipes(new CustomValidationPipe())

  // Global filters
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new ValidationExceptionFilter()
  )

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor())

  if (configService.get('NODE_ENV') !== 'production') {
    setupSwagger(app)
  }

  const port = configService.get<number>('PORT', 4000)
  await app.listen(port)

  console.log(`🚀 API Gateway is running on port ${port}`)
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`)
}
bootstrap()
