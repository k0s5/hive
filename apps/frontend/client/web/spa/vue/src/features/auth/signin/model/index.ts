import { useRouter } from 'vue-router'
import useUserStore from '@/entities/user/model/store'
import { signin } from '../api'
import type { SigninRequestPayload } from '@hive/shared'

export function useSignIn() {
  const userStore = useUserStore()
  const router = useRouter()

  const signInHandler = async (payload: SigninRequestPayload) => {
    const res = await signin(payload)

    if (res.success && res.data) {
      userStore.user = res.data.user
      userStore.accessToken = res.data.tokens.accessToken
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
      await router.push({ name: 'home' })
    }
  }

  return {
    signInHandler,
  }
}
