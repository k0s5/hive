<script setup lang="ts">
import type { FormResolverOptions, FormSubmitEvent } from '@primevue/forms'
import { useSignIn } from '../model'

const { signInHandler } = useSignIn()

const initialValues = {
  email: '',
  password: '',
}

const resolver = ({ names, values }: FormResolverOptions) => {
  const errors: Record<string, { message: string }[]> = {
    email: [],
    password: [],
  }

  if (!values.email) {
    errors.email = [{ message: 'Email is required' }]
  }

  if (!values.password) {
    errors.password = [{ message: 'Password is required' }]
  }

  if (values.password.length < 6) {
    errors.password = [
      { message: 'Password must contain minimum 6 characters' },
    ]
  }

  return {
    names,
    values,
    errors,
  }
}

const submit = async (event: FormSubmitEvent) => {
  if (!event.valid) {
    return
  }
  const signupDto = {
    email: event.values.email,
    password: event.values.password,
  }
  try {
    await signInHandler(signupDto)
  } catch (err: unknown) {
    console.error(err)
  }
}

const messageTextPt = {
  text: {
    class: 'text-xs!',
  },
}
</script>

<template>
  <Form
    v-slot="$form"
    :initialValues
    :resolver
    @submit="submit"
    class="flex flex-col gap-4 w-full sm:w-56"
  >
    <div class="flex flex-col gap-1">
      <!-- <label for="email" class="text-sm">Email</label> -->
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-envelope"></i>
        </InputGroupAddon>
        <InputText name="email" placeholder="Email" />
      </InputGroup>
      <Message
        v-if="$form.email?.invalid"
        severity="error"
        size="small"
        variant="simple"
        :pt="messageTextPt"
        >{{ $form.email.error.message }}</Message
      >
    </div>
    <div class="flex flex-col gap-1">
      <!-- <label for="password" class="text-sm">Password</label> -->
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-lock"></i>
        </InputGroupAddon>
        <InputText name="password" type="password" placeholder="Password" />
      </InputGroup>
      <Message
        v-if="$form.password?.invalid"
        severity="error"
        size="small"
        variant="simple"
        :pt="messageTextPt"
        >{{ $form.password.error.message }}</Message
      >
    </div>
    <Button type="submit" label=" Signin" class="mt-1" />
  </Form>
  <p class="mt-6 text-xs">
    Don't have an account yet?
    <RouterLink :to="{ name: 'signup' }">Signup</RouterLink>
  </p>
</template>

<style lang="scss" scoped></style>
