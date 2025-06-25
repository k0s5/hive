<script setup lang="ts">
import { ChatHeader } from '@entities/chat'
import { MessageList, MessageInput } from '@widgets/message'
import { ref, onMounted } from 'vue'

const chatBodyRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
})
</script>

<template>
  <div class="chat-window">
    <ChatHeader />
    <div ref="chatBodyRef" class="chat-body">
      <MessageList />
      <MessageInput />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-window {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--p-card-background);
}
.chat-body {
  padding: 0.5rem;
  height: calc(100% - 81px);
  overflow: auto;
  padding-bottom: 5rem;
}
</style>
