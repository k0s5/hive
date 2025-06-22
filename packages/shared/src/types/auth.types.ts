import type { User } from './user.types'

export interface SignupRequest {
  email: string
  password: string
}

export interface SignupResponse {
  user: User
  tokens: AuthTokens
}

export interface SigninRequest {
  email: string
  password: string
}

export interface SigninResponse extends SignupResponse {}

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

export interface AuthResponse {
  success: boolean
  data: {
    user: any
    accessToken: string
    refreshToken: string
  }
}

export interface RefreshTokenResponse {
  success: boolean
  data: AuthTokens
}

export interface SignoutResponse {
  success: boolean
  message: string
}
