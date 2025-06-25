import { refresh } from '../api'
import useUserStore from '@/entities/user/model/store'

export function useRefreshAuthTokens() {
  const userStore = useUserStore()

  const refreshAuthTokens = async () => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      throw new Error('Refresh token is missing')
    }

    const res = await refresh(refreshToken)

    if (
      res.success &&
      res.data?.tokens?.accessToken &&
      res.data?.tokens?.refreshToken
    ) {
      userStore.user = res.data.user
      userStore.accessToken = res.data.tokens.accessToken
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
    }
  }

  return { refreshAuthTokens }
}
