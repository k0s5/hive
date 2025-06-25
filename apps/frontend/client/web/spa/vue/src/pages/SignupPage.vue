<script setup lang="ts">
import { SignupForm } from '@features/auth/signup'
</script>

<template>
  <div class="signup-form flex flex-col items-center">
    <h1 class="text-2xl mb-8">Signup</h1>
    <SignupForm />
  </div>
</template>

<style lang="scss" scoped>
.signup-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>
