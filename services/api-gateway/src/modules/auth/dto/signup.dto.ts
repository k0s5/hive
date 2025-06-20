import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator'
import { VALIDATION_RULES, ERROR_MESSAGES } from '@hive/shared'

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: ERROR_MESSAGES.COMMON.INVALID_FORMAT('Email') })
  email: string

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
    minLength: VALIDATION_RULES.AUTH.PASSWORD_MIN_LENGTH,
    maxLength: VALIDATION_RULES.AUTH.PASSWORD_MAX_LENGTH,
  })
  @IsString()
  @MinLength(VALIDATION_RULES.AUTH.PASSWORD_MIN_LENGTH, {
    message: ERROR_MESSAGES.COMMON.MIN_LENGTH(
      'Password',
      VALIDATION_RULES.AUTH.PASSWORD_MIN_LENGTH
    ),
  })
  @MaxLength(VALIDATION_RULES.AUTH.PASSWORD_MAX_LENGTH, {
    message: ERROR_MESSAGES.COMMON.MIN_LENGTH(
      'Password',
      VALIDATION_RULES.AUTH.PASSWORD_MAX_LENGTH
    ),
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/, {
    message: ERROR_MESSAGES.AUTH.PASSWORD_MATCH,
  })
  password: string

  // @ApiProperty({
  //   description: 'User username',
  //   example: 'john_doe',
  //   minLength: VALIDATION_RULES.AUTH.USERNAME_MIN_LENGTH,
  //   maxLength: VALIDATION_RULES.AUTH.USERNAME_MAX_LENGTH,
  // })
  // @IsString()
  // @MinLength(VALIDATION_RULES.AUTH.USERNAME_MIN_LENGTH, {
  //   message: `Username too short. Minimum ${VALIDATION_RULES.AUTH.USERNAME_MIN_LENGTH} characters long.`,
  // })
  // @MaxLength(VALIDATION_RULES.AUTH.USERNAME_MAX_LENGTH, {
  //   message: `Username too long. Maximum ${VALIDATION_RULES.AUTH.USERNAME_MAX_LENGTH} characters long.`,
  // })
  // @Matches(/^[a-zA-Z0-9_-]+$/, {
  //   message: 'Username can only contain letters, numbers, underscore, and dash',
  // })
  // username: string

  // @ApiProperty({
  //   description: 'User first name',
  //   example: 'John',
  //   minLength: VALIDATION_RULES.AUTH.NAME_MIN_LENGTH,
  //   maxLength: VALIDATION_RULES.AUTH.NAME_MAX_LENGTH,
  // })
  // @IsString()
  // @MinLength(VALIDATION_RULES.AUTH.NAME_MIN_LENGTH, {
  //   message: `First name must be at least ${VALIDATION_RULES.AUTH.NAME_MIN_LENGTH} characters long`,
  // })
  // @MaxLength(VALIDATION_RULES.AUTH.NAME_MAX_LENGTH, {
  //   message: `First name cannot exceed ${VALIDATION_RULES.AUTH.NAME_MAX_LENGTH} characters`,
  // })
  // firstName: string

  // @ApiProperty({
  //   description: 'User last name',
  //   example: 'Doe',
  //   minLength: VALIDATION_RULES.AUTH.NAME_MIN_LENGTH,
  //   maxLength: VALIDATION_RULES.AUTH.NAME_MAX_LENGTH,
  // })
  // @IsString()
  // @MinLength(VALIDATION_RULES.AUTH.NAME_MIN_LENGTH, {
  //   message: `Last name must be at least ${VALIDATION_RULES.AUTH.NAME_MIN_LENGTH} characters long`,
  // })
  // @MaxLength(VALIDATION_RULES.AUTH.NAME_MAX_LENGTH, {
  //   message: `Last name cannot exceed ${VALIDATION_RULES.AUTH.NAME_MAX_LENGTH} characters`,
  // })
  // lastName: string
}
