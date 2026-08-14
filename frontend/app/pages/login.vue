<template>
  <AuthCard
    kicker="Account"
    title="Sign in"
    subtitle="Your orders, saved cards and delivery details in one place."
  >
    <form
      class="flex flex-col gap-6"
      novalidate
      @submit="onSubmit"
    >
      <div class="grid grid-cols-1 gap-4">
        <UiFormField
          label="Email"
          input-id="li-email"
          :error="errors.email"
        >
          <VoltInputText
            id="li-email"
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            autocomplete="email"
            placeholder="jane@example.com"
            :class="{ 'p-invalid': errors.email }"
          />
        </UiFormField>

        <div class="flex min-w-0 flex-col gap-1.5">
          <div class="flex items-baseline justify-between gap-3">
            <label
              for="li-password"
              class="text-sm font-semibold"
            >
              Password
            </label>
            <NuxtLink
              to="/forgot-password"
              class="text-brand hover:text-brand-hover text-xs font-semibold hover:underline hover:underline-offset-[3px]"
            >
              Forgot password?
            </NuxtLink>
          </div>
          <VoltPassword
            v-model="password"
            input-id="li-password"
            v-bind="passwordAttrs"
            :feedback="false"
            toggle-mask
            autocomplete="current-password"
            placeholder="Your password"
            :class="{ 'p-invalid': errors.password }"
          />
          <small
            v-if="errors.password"
            class="text-badge text-xs font-medium"
          >
            {{ errors.password }}
          </small>
        </div>
      </div>

      <p
        v-if="failure"
        class="text-badge text-xs font-medium"
      >
        {{ failure }}
      </p>

      <div class="flex flex-col gap-3">
        <VoltButton
          type="submit"
          :loading="busy"
          class="w-full justify-center"
        >
          Sign in
        </VoltButton>
      </div>

      <p class="text-muted text-center text-sm">
        New here?
        <NuxtLink
          to="/register"
          class="text-brand hover:text-brand-hover font-semibold hover:underline hover:underline-offset-[3px]"
        >
          Create an account
        </NuxtLink>
      </p>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { loginSchema } from '~/features/auth/schemas/auth'

definePageMeta({ layout: 'app' })

const { login } = useAuthActions()

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const busy = ref(false)
const failure = ref('')

// Seeded credentials in the mock API: jane@example.com / farmsupply.
const onSubmit = handleSubmit(async (values) => {
  busy.value = true
  failure.value = ''

  try {
    await login({ email: values.email, password: values.password })
  } catch (error) {
    failure.value = apiMessage(error, 'Could not sign you in. Please try again.')
  } finally {
    busy.value = false
  }
})

useHead({ title: 'Sign in' })
useSeoMeta({ robots: 'noindex' })
</script>
