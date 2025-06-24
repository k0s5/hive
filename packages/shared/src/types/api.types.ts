export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/*
error: {
  type: string, validation_error | conflict | server_error
  details: {
    email: {
      message: 'Not valid email'
    },
    password: {
      message: 'Too short'
    },
  }
}
*/
