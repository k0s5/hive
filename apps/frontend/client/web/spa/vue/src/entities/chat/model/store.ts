import { defineStore } from 'pinia'
import { ref } from 'vue'

const useChatStore = defineStore('ChatStore', () => {
  const isLoading = ref<boolean>(false)

  return { isLoading }
})

export default useChatStore
