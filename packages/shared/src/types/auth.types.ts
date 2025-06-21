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
  iat: number
  exp: number
}
