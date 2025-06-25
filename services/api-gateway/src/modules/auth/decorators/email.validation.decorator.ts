import { IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export function IsValidEmail() {
  return function (target: any, propertyKey: string) {
    IsEmail(undefined, {
      message: 'Not a valid email format',
    })(target, propertyKey)

    ApiProperty({
      description: 'User email address',
      example: 'john@example.com',
    })(target, propertyKey)
  }
}
