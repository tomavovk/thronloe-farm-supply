<template>
  <AuthCard
    v-if="!sentTo"
    kicker="Step 1 of 2"
    title="Reset your password"
    subtitle="Enter the email on your account and we’ll send you a reset link."
  >
    <form
      class="flex flex-col gap-6"
      novalidate
      @submit="onSubmit"
    >
      <UiFormField
        label="Email"
        input-id="fg-email"
        :error="errors.email"
      >
        <VoltInputText
          id="fg-email"
          v-model="email"
          v-bind="emailAttrs"
          type="email"
          autocomplete="email"
          placeholder="jane@example.com"
          :class="{ 'p-invalid': errors.email }"
        />
      </UiFormField>

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
          Send reset link
        </VoltButton>
        <VoltButton
          to="/login"
          severity="secondary"
          class="w-full justify-center"
        >
          Back to sign in
        </VoltButton>
      </div>
    </form>
  </AuthCard>

  <AuthCard
    v-else
    title="Check your email"
  >
    <template #icon>
      <span
        class="border-line text-brand mb-6 flex h-14 w-14 items-center justify-center border bg-panel"
      >
        <span
          class="sl-icon text-[26px]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="square"
            stroke-linejoin="miter"
          >
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
            />
            <polyline points="2 5 12 13 22 5" />
          </svg>
        </span>
      </span>
    </template>

    <template #subtitle>
      We sent a reset link to
      <strong class="text-ink">{{ sentTo }}</strong
      >. The link works for 30 minutes.
    </template>

    <div class="flex flex-col gap-3">
      <VoltButton
        to="/reset-password"
        class="w-full justify-center"
      >
        Open the reset link
      </VoltButton>
      <VoltButton
        severity="secondary"
        class="w-full justify-center"
        @click="resend"
      >
        {{ resent ? 'Sent again' : 'Send it again' }}
      </VoltButton>
    </div>

    <p class="text-muted text-center text-sm">
      Wrong address?
      <button
        type="button"
        class="text-brand hover:text-brand-hover text-xs font-semibold hover:underline hover:underline-offset-[3px]"
        @click="sentTo = ''"
      >
        Use a different email
      </button>
    </p>
  </AuthCard>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { forgotSchema } from '~/features/auth/schemas/auth'

definePageMeta({ layout: 'app' })

// Both steps of the design's forgot-password flow live here: the email form, then
// the "check your email" confirmation (design swaps #fgStep1 for #fgStep2).
const { requestPasswordReset } = useAuthActions()

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(forgotSchema),
})

const [email, emailAttrs] = defineField('email')
const sentTo = ref('')
const resent = ref(false)
const busy = ref(false)
const failure = ref('')

const onSubmit = handleSubmit(async (values) => {
  busy.value = true
  failure.value = ''

  try {
    const { sentTo: address } = await requestPasswordReset(values.email)
    sentTo.value = address
    resent.value = false
  } catch (error) {
    failure.value = apiMessage(error)
  } finally {
    busy.value = false
  }
})

const resend = async () => {
  await requestPasswordReset(sentTo.value).catch(() => {})
  resent.value = true

  setTimeout(() => {
    resent.value = false
  }, 2000)
}

useHead({ title: 'Reset password' })
useSeoMeta({ robots: 'noindex' })
</script>
