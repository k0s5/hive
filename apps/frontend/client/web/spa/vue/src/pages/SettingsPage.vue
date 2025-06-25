<script setup lang="ts">
import { MainLayout } from './layouts'
import { Sidebar } from '@widgets/sidebar'
</script>

<template>
  <MainLayout>
    <template #sidebar>
      <Sidebar>Settings menu</Sidebar>
    </template>
    <div>Settings Page</div>
  </MainLayout>
</template>
