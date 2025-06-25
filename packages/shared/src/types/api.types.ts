export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
  path?: string
  method?: string
  deatails?: Record<string, unknown>
}

export interface ApiSuccessResponse<T = unknown> extends ApiResponse {
  success: true
  data: T
}

export interface ApiErrorResponse extends ApiResponse {
  success: false
  error: string
  message: string
  timestamp: string
  path: string
  method: string
  deatails: Record<string, unknown>
}

/*
error: {
  success: false,
  error: 'Bad Request',
  message: 'Validation failed',
  type?: string, validation_error | conflict | server_error
  errorCode?: number,
  details: {
    email: [
      {
        message: 'Not valid email',
        constraint: "isEmail"
      },
      {
        message: 'Not valid email',
        constraint: "isEmail"
      },
    ],
    password: [
      {
        message: 'Too short',
        constraint: 'minLength'
      },
      {
        message: 'Password must contain one upercase letter...',
        constraint: 'match'
      },
    ],
  }
}
*/
