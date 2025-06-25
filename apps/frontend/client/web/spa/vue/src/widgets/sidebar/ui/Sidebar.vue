<script setup lang="ts"></script>

<template>
  <aside class="sidebar">
    <slot></slot>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  padding: 0.5rem;
  width: 400px;
  height: 100%;
  background-color: var(--p-surface-ground);
}
</style>
