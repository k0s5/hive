<script setup lang="ts">
import { useMessageFormattedDate } from '@shared/composables/date'

const { item: chatItem } = defineProps<{
  item: {
    title: string
    lastMessage: string
    lastMessageDate: Date
    unreadMessagesCount: number
  }
}>()

const createdAt = useMessageFormattedDate(chatItem.lastMessageDate)
</script>

<template>
  <div class="chat-item">
    <div class="chat-item__image"></div>
    <div class="chat-item__body">
      <div class="chat-item__title">{{ chatItem.title }}</div>
      <div class="chat-item__last-message">{{ chatItem.lastMessage }}</div>
    </div>
    <div class="chat-item__info">
      <div class="chat-item__last-message-date">
        {{ createdAt }}
      </div>
      <div class="chat-item__unread-messages">
        {{ chatItem.unreadMessagesCount }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-item {
  &:not(:first-of-type) {
    margin-top: 0.5rem;
  }

  padding: 0.75rem 0.5rem;
  width: 100%;
  height: 4.5rem;
  display: flex;
  gap: 0.75rem;
  background-color: var(--p-card-background);
  color: var(--p-content-color);
  border-radius: 0.375rem;
  cursor: pointer;
}
.chat-item__image {
  min-width: 3rem;
  min-height: 3rem;
  width: 3rem;
  height: 3rem;
  border-radius: 20rem;
  background-color: var(--p-primary-400);
}
.chat-item__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.chat-item__title {
  font-size: 0.875rem;
}
.chat-item__last-message {
  font-size: 0.625rem;
}
.chat-item__info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
}
.chat-item__last-message-date {
  font-size: 0.625rem;
  color: var(--p-surface-600);
}
.chat-item__unread-messages {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20rem;
  background-color: var(--p-primary-400);
  color: var(--p-content-background);
  font-size: 0.625rem;
  font-weight: 700;
}
</style>
