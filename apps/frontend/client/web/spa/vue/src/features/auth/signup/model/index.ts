import { useRouter } from 'vue-router'
import useUserStore from '@/entities/user/model/store'
import { signup } from '../api'
import type { SignupRequestPayload } from '@hive/shared'

export function useSignUp() {
  const userStore = useUserStore()
  const router = useRouter()

  const signUpHandler = async (payload: SignupRequestPayload) => {
    const res = await signup(payload)

    if (res.success && res.data) {
      userStore.user = res.data.user
      userStore.accessToken = res.data.tokens.accessToken
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
      await router.push({ name: 'home' })
    }
  }

  return {
    signUpHandler,
  }
}
