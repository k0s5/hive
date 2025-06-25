import { computed } from 'vue'
import type { User } from '@hive/shared'

export function isUserMessage(userId: User['id']) {
  return computed(() => userId !== '1') //todo заменить на реальный userId из UserStore
}
