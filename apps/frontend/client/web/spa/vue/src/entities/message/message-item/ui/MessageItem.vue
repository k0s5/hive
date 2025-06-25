<script setup lang="ts">
import { isUserMessage } from '../model'
import { useMessageFormattedDate } from '@shared/composables/date'

const {
  text,
  userId,
  createdAt: messageCreatedAt,
} = defineProps<{
  text: string
  userId: string
  createdAt: Date
}>()

const isIncomingMessage = isUserMessage(userId)
const createdAt = useMessageFormattedDate(messageCreatedAt)
</script>

<template>
  <div
    class="message-item"
    :class="isIncomingMessage ? 'incoming' : 'outgoing'"
  >
    <div class="message-item__text">{{ text }}</div>
    <div class="message-item__date">{{ createdAt }}</div>
  </div>
</template>

<style lang="scss" scoped>
.message-item {
  padding: 0.75rem;
  max-width: 18rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.incoming {
  border-radius: 0.5rem 0.5rem 0.5rem 0;
  background-color: var(--p-background-800);
  align-self: flex-start;
}
.outgoing {
  background-color: var(--p-background-700);
  border-radius: 0.5rem 0.5rem 0 0.5rem;
  align-self: flex-end;
}
.message-item__date {
  font-size: 0.625rem;
}
.incoming .message-item__date {
  color: var(--p-background-600);
}
.outgoing .message-item__date {
  color: var(--p-background-500);
}
</style>
