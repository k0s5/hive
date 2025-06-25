import { IsValidEmail, IsValidPassword } from '../decorators'

export class SigninDto {
  @IsValidEmail()
  email: string

  @IsValidPassword()
  password: string
}
