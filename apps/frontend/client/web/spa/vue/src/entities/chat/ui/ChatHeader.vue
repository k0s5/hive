<script setup lang="ts">
const { title = 'Chat Title', status = 'Chat Status' } = defineProps<{
  title: string
  status: string
}>()
</script>

<template>
  <div class="chat-header">
    <div class="chat-header__image chat-item__image"></div>
    <div class="chat-header__main">
      <div class="chat-header__title">{{ title }}</div>
      <div class="chat-header__status">{{ status }}</div>
    </div>
    <div class="chat-header__actions">
      <slot name="actions">
        <Button
          icon="pi pi-search"
          size="small"
          severity="secondary"
          rounded
          aria-label="Search"
        />
        <Button
          icon="pi pi-ellipsis-v"
          size="small"
          severity="secondary"
          rounded
          aria-label="Options"
        />
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-header {
  padding: 1rem 0.75rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  border-bottom: 1px solid var(--p-content-border-color);
}
.chat-header__main {
  width: 100%;
}
.chat-header__title {
  font-size: 1rem;
}
.chat-header__status {
  color: var(--p-surface-600);
  font-size: 0.75rem;
}
.chat-header__actions {
  display: flex;
  gap: 0.5rem;
}
</style>
