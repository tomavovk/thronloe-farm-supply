<template>
  <AuthCard
    kicker="Step 2 of 2"
    title="Set a new password"
    subtitle="Pick something at least 8 characters long. You’ll be signed in straight after."
  >
    <form
      class="flex flex-col gap-6"
      novalidate
      @submit="onSubmit"
    >
      <div class="grid grid-cols-1 gap-4">
        <UiFormField
          label="New password"
          input-id="rs-password"
          :error="errors.password"
        >
          <VoltPassword
            v-model="password"
            input-id="rs-password"
            v-bind="passwordAttrs"
            :feedback="false"
            toggle-mask
            autocomplete="new-password"
            placeholder="At least 8 characters"
            :class="{ 'p-invalid': errors.password }"
          />
        </UiFormField>

        <UiFormField
          label="Repeat new password"
          input-id="rs-password-repeat"
          :error="errors.passwordRepeat"
        >
          <VoltPassword
            v-model="passwordRepeat"
            input-id="rs-password-repeat"
            v-bind="passwordRepeatAttrs"
            :feedback="false"
            toggle-mask
            autocomplete="new-password"
            placeholder="Repeat the password"
            :class="{ 'p-invalid': errors.passwordRepeat }"
          />
        </UiFormField>
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
          Save password and sign in
        </VoltButton>
      </div>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { resetSchema } from '~/features/auth/schemas/auth'

definePageMeta({ layout: 'app' })

const { changePassword } = useAuthActions()

const { handleSubmit, errors, defineField, setErrors } = useForm({
  validationSchema: toTypedSchema(resetSchema),
})

const [password, passwordAttrs] = defineField('password')
const [passwordRepeat, passwordRepeatAttrs] = defineField('passwordRepeat')

const busy = ref(false)
const failure = ref('')

// Design: saving the password signs you in and drops you into the account.
const onSubmit = handleSubmit(async (values) => {
  busy.value = true
  failure.value = ''

  try {
    await changePassword(values)
  } catch (error) {
    const fields = apiFieldErrors(error)

    if (Object.keys(fields).length) {
      setErrors(fields)
    } else {
      failure.value = apiMessage(error)
    }
  } finally {
    busy.value = false
  }
})

useHead({ title: 'New password' })
useSeoMeta({ robots: 'noindex' })
</script>
