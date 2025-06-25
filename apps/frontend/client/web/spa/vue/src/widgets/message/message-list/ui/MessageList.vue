<script setup lang="ts">
import { MessageItem } from '@entities/message'
import { chat1Messages } from '@shared/mock'
</script>

<template>
  <div class="message-list">
    <MessageItem
      v-for="message of chat1Messages"
      :key="message.id"
      :userId="message.userId"
      :text="message.text"
      :createdAt="message.createdAt"
    />
  </div>
</template>

<style lang="scss" scoped>
.message-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
