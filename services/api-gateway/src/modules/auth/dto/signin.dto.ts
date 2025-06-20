import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
import { VALIDATION_RULES, ERROR_MESSAGES } from '@hive/shared'

export class SigninDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
  })
  @IsString()
  @MinLength(VALIDATION_RULES.AUTH.PASSWORD_MIN_LENGTH, {
    message: ERROR_MESSAGES.COMMON.REQUIRED('Password'),
  })
  @MaxLength(VALIDATION_RULES.AUTH.PASSWORD_MAX_LENGTH, {
    message: ERROR_MESSAGES.COMMON.MAX_LENGTH(
      'Password',
      VALIDATION_RULES.AUTH.PASSWORD_MAX_LENGTH
    ),
  })
  password: string
}
