import type { AuthResponseDto } from '@hive/shared'

export const signin = async (signinDto: {
  email: string
  password: string
}) => {
  const req = await fetch('http://localhost:4000/api/v1/auth/signin', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signinDto),
  })

  const res = await req.json()

  return res as AuthResponseDto
}
