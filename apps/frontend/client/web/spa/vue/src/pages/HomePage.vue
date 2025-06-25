<script setup lang="ts">
import { MainLayout } from './layouts'
import { Sidebar } from '@widgets/sidebar'
import { ChatWindow } from '@widgets/chat'
import { ChatList } from '@/widgets/chat'
</script>

<template>
  <MainLayout>
    <template #sidebar>
      <Sidebar>
        <ChatList />
      </Sidebar>
    </template>
    <ChatWindow />
  </MainLayout>
</template>
