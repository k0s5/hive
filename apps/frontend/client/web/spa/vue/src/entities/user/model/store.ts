import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@hive/shared'

const useUserStore = defineStore('UserStore', () => {
  const isLoading = ref<boolean>(false)
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  return { isLoading, user, accessToken }
})

export default useUserStore
