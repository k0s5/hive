<script setup lang="ts">
import { SigninForm } from '@features/auth/signin'
</script>

<template>
  <div class="signin-form flex flex-col items-center">
    <h1 class="text-2xl mb-8">Signin</h1>
    <SigninForm />
  </div>
</template>

<style lang="scss" scoped>
.signin-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>
