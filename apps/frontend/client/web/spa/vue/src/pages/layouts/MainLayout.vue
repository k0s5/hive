<script setup lang="ts"></script>

<template>
  <div class="main-layout">
    <slot name="sidebar"></slot>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  width: 100%;
  height: 100%;
  display: flex;
}
main {
  width: 100%;
  height: 100%;
}
</style>
