import { IsValidEmail, IsValidPassword } from '../decorators'

export class SignupDto {
  @IsValidEmail()
  email: string

  @IsValidPassword()
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
