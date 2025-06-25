<script setup lang="ts">
import { ChatItem } from '@entities/chat'
import { chat1Messages, chat2Messages } from '@/shared/mock'

const chat1LastMessage = chat1Messages[chat1Messages.length - 1]
const chat2LastMessage = chat2Messages[chat2Messages.length - 1]

const chatItems = [
  {
    title: 'Иван Петров',
    lastMessage: chat1LastMessage.text,
    lastMessageDate: chat1LastMessage.createdAt,
    unreadMessages: 10,
  },
  {
    title: 'Евгений Сидоров',
    lastMessage: chat2LastMessage.text,
    lastMessageDate: chat2LastMessage.createdAt,
    unreadMessages: 5,
  },
]
</script>

<template>
  <div class="chat-list">
    <ChatItem
      v-for="chatItem of chatItems"
      :key="chatItem.title"
      :item="chatItem"
    />
  </div>
</template>
