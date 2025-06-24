import { ApiResponse } from './api.types'
import type { User } from './user.types'

export interface SignupRequestPayload {
  email: string
  password: string
}

export interface SignupResponsePayload {
  user: User
  tokens: AuthTokens
}

export interface SigninRequestPayload {
  email: string
  password: string
}

export interface SigninResponsePayload extends SignupResponsePayload {}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  userId: string
  email: string
  username?: string
  jti?: string // JWT ID for token tracking
  sub?: string // Subject (alternative to jti)
  iat?: number // Issued at
  exp?: number // Expiration time
}

// Api responses
export interface AuthResponseDto
  extends ApiResponse<SigninResponsePayload | SignupResponsePayload> {}

export interface RefreshTokenResponseDto
  extends ApiResponse<{ user: User; tokens: AuthTokens }> {}

export interface SignoutResponseDto extends ApiResponse {
  message: string
}
