import { IsString, MinLength, MaxLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { VALIDATION_RULES, ERROR_MESSAGES } from '@hive/shared'

export function IsValidPassword() {
  return function (target: any, propertyKey: string) {
    IsString()(target, propertyKey)

    MinLength(VALIDATION_RULES.AUTH.PASSWORD_MIN_LENGTH, {
      message: ERROR_MESSAGES.COMMON.MIN_LENGTH(
        'Password',
        VALIDATION_RULES.AUTH.PASSWORD_MIN_LENGTH
      ),
    })(target, propertyKey)

    MaxLength(VALIDATION_RULES.AUTH.PASSWORD_MAX_LENGTH, {
      message: ERROR_MESSAGES.COMMON.MAX_LENGTH(
        'Password',
        VALIDATION_RULES.AUTH.PASSWORD_MAX_LENGTH
      ),
    })(target, propertyKey)

    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/, {
      message: ERROR_MESSAGES.AUTH.PASSWORD_MATCH,
    })(target, propertyKey)

    ApiProperty({
      description: 'User password',
      example: 'Password123',
    })(target, propertyKey)
  }
}
