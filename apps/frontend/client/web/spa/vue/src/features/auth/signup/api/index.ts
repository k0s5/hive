import type { AuthResponseDto } from '@hive/shared'

export const signup = async (signupDto: {
  email: string
  password: string
}) => {
  const req = await fetch('http://localhost:4000/api/v1/auth/signup', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupDto),
  })

  const res = await req.json()

  return res as AuthResponseDto
}
