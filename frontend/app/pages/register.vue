<template>
  <AuthCard
    wide
    kicker="Account"
    title="Create an account"
    subtitle="Only name, email and password are required — everything else you can add now or later in Account."
  >
    <form
      class="flex flex-col gap-6"
      novalidate
      @submit="onSubmit"
    >
      <div>
        <p :class="SECTION_TITLE">Sign-in details</p>
        <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <UiFormField
            label="Full name"
            input-id="rg-name"
            required
            :error="errors.name"
          >
            <VoltInputText
              id="rg-name"
              v-model="name"
              v-bind="nameAttrs"
              type="text"
              autocomplete="name"
              placeholder="Jane Smith"
              :class="{ 'p-invalid': errors.name }"
            />
          </UiFormField>

          <UiFormField
            label="Email"
            input-id="rg-email"
            required
            :error="errors.email"
          >
            <VoltInputText
              id="rg-email"
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              autocomplete="email"
              placeholder="jane@example.com"
              :class="{ 'p-invalid': errors.email }"
            />
          </UiFormField>

          <UiFormField
            label="Password"
            input-id="rg-password"
            required
            :error="errors.password"
          >
            <VoltPassword
              v-model="password"
              input-id="rg-password"
              v-bind="passwordAttrs"
              :feedback="false"
              toggle-mask
              autocomplete="new-password"
              placeholder="At least 8 characters"
              :class="{ 'p-invalid': errors.password }"
            />
          </UiFormField>

          <UiFormField
            label="Repeat password"
            input-id="rg-password-repeat"
            required
            :error="errors.passwordRepeat"
          >
            <VoltPassword
              v-model="passwordRepeat"
              input-id="rg-password-repeat"
              v-bind="passwordRepeatAttrs"
              :feedback="false"
              toggle-mask
              autocomplete="new-password"
              placeholder="Repeat password"
              :class="{ 'p-invalid': errors.passwordRepeat }"
            />
          </UiFormField>
        </div>
      </div>

      <div>
        <p :class="SECTION_TITLE">
          Contact &amp; billing
          <span class="font-medium normal-case tracking-normal">(optional)</span>
        </p>
        <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <UiFormField
            v-for="field in OPTIONAL_FIELDS"
            :key="field.name"
            :label="field.label"
            :input-id="`rg-${field.name}`"
          >
            <VoltInputText
              :id="`rg-${field.name}`"
              v-model="optional[field.name]"
              :type="field.type ?? 'text'"
              :autocomplete="field.autocomplete"
              :placeholder="field.placeholder"
            />
          </UiFormField>

          <UiFormField
            label="Preferred run"
            input-id="rg-run"
          >
            <VoltSelect
              id="rg-run"
              v-model="preferredRun"
              :options="[...PREFERRED_RUNS]"
              placeholder="Select one"
            />
          </UiFormField>
        </div>
      </div>

      <!-- Design behaviour: submitting with the optional block empty asks once
           whether to continue or fill it in, instead of blocking the sign-up. -->
      <div
        v-if="askAboutOptional"
        class="border-brand text-ink flex items-start gap-3 border bg-brand-soft px-6 py-4 text-sm"
      >
        <span
          class="sl-icon text-brand mt-0.5 flex-none text-[18px]"
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
            <circle
              cx="12"
              cy="12"
              r="9"
            />
            <line
              x1="12"
              y1="11"
              x2="12"
              y2="17"
            />
            <line
              x1="12"
              y1="7.5"
              x2="12"
              y2="8.5"
            />
          </svg>
        </span>
        <span>
          <strong class="mb-0.5 block font-semibold">Some details are still empty</strong>
          You can continue now and fill the rest in later in Account — we’ll ask for them later.
          <span class="mt-3 flex flex-wrap gap-2">
            <VoltButton
              size="sm"
              @click="createAccount"
            >
              Continue anyway
            </VoltButton>
            <VoltButton
              size="sm"
              severity="secondary"
              @click="askAboutOptional = false"
            >
              Fill them in now
            </VoltButton>
          </span>
        </span>
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
          Create account
        </VoltButton>
      </div>

      <p class="text-muted text-center text-sm">
        Already have an account?
        <NuxtLink
          to="/login"
          class="text-brand hover:text-brand-hover font-semibold hover:underline hover:underline-offset-[3px]"
        >
          Sign in
        </NuxtLink>
      </p>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { PREFERRED_RUNS, registerSchema } from '~/features/auth/schemas/auth'

definePageMeta({ layout: 'app' })

const { register } = useAuthActions()

const SECTION_TITLE = 'text-muted mb-4 text-xs font-semibold tracking-[0.12em] uppercase'

// Typed as one shape so the template can read `field.type` / `field.autocomplete`
// on every entry — a bare `as const` array infers a union where some members lack
// those keys.
interface OptionalField {
  name: 'phone' | 'farm' | 'address1' | 'address2' | 'city' | 'province' | 'postal'
  label: string
  placeholder: string
  type?: string
  autocomplete?: string
}

const OPTIONAL_FIELDS: readonly OptionalField[] = [
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    autocomplete: 'tel',
    placeholder: '(705) 000-0000',
  },
  { name: 'farm', label: 'Farm / business', placeholder: 'Smith Bros. Dairy' },
  {
    name: 'address1',
    label: 'Address line 1',
    autocomplete: 'address-line1',
    placeholder: 'Street address',
  },
  {
    name: 'address2',
    label: 'Address line 2',
    autocomplete: 'address-line2',
    placeholder: 'Suite, unit, or gate code',
  },
  { name: 'city', label: 'City', autocomplete: 'address-level2', placeholder: 'City' },
  { name: 'province', label: 'Province', autocomplete: 'address-level1', placeholder: 'Province' },
  { name: 'postal', label: 'Postal code', autocomplete: 'postal-code', placeholder: 'P0J 1S0' },
] as const

const { handleSubmit, errors, defineField, values, setErrors } = useForm({
  validationSchema: toTypedSchema(registerSchema),
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordRepeat, passwordRepeatAttrs] = defineField('passwordRepeat')
const [preferredRun] = defineField('preferredRun')

// The optional block is one bag of strings; only its emptiness matters here.
const optional = ref<Record<(typeof OPTIONAL_FIELDS)[number]['name'], string>>({
  phone: '',
  farm: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  postal: '',
})

const askAboutOptional = ref(false)

const optionalIsEmpty = computed(() =>
  ['phone', 'farm', 'address1', 'city', 'province', 'postal'].every(
    (key) => !optional.value[key as keyof typeof optional.value]?.trim(),
  ),
)

const busy = ref(false)
const failure = ref('')

const createAccount = async () => {
  busy.value = true
  failure.value = ''

  try {
    await register({
      name: values.name,
      email: values.email,
      password: values.password,
      passwordRepeat: values.passwordRepeat,
      preferredRun: values.preferredRun,
      ...optional.value,
    })
  } catch (error) {
    const fields = apiFieldErrors(error)

    if (Object.keys(fields).length) {
      setErrors(fields)
      askAboutOptional.value = false
    } else {
      failure.value = apiMessage(error)
    }
  } finally {
    busy.value = false
  }
}

const onSubmit = handleSubmit(() => {
  if (optionalIsEmpty.value && !askAboutOptional.value) {
    askAboutOptional.value = true

    return
  }

  return createAccount()
})

useHead({ title: 'Create account' })
useSeoMeta({ robots: 'noindex' })
</script>
