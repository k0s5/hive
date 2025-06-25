import type { RefreshTokenResponseDto } from '@hive/shared'

export const refresh = async (refreshToken: string) => {
  const req = await fetch('http://localhost:4000/api/v1/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })

  const res = await req.json()

  return res as RefreshTokenResponseDto
}
