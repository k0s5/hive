import { defineStore } from 'pinia'
import { ref } from 'vue'

const useAppStore = defineStore('AppStore', () => {
  const isLoading = ref<boolean>(false)

  return {
    isLoading
  }
})

export default useAppStore
