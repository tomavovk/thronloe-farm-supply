<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div class="min-h-0 flex-1 overflow-y-auto">
      <div class="flex max-w-[820px] flex-col gap-8 p-4 sm:p-6">
        <div class="border-line border-b pb-4">
          <h1 class="text-xl font-semibold">Account</h1>
          <p class="text-muted mt-1 text-sm">Keep your contact and delivery details up to date.</p>
        </div>

        <div
          v-for="block in BLOCKS"
          :key="block.title"
        >
          <p :class="BLOCK_TITLE">
            {{ block.title }}
          </p>

          <label
            v-if="block.key === 'delivery'"
            class="mb-4 flex cursor-pointer items-center gap-2.5 text-sm font-medium"
          >
            <VoltCheckbox
              v-model="sameAsBilling"
              binary
            />
            Same as billing address
          </label>

          <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <UiFormField
              v-for="field in block.fields"
              :key="field.name"
              :label="field.label"
              :input-id="`ac-${field.name}`"
              :full="field.full"
            >
              <VoltInputText
                :id="`ac-${field.name}`"
                v-model="form[field.name]"
                :type="field.type ?? 'text'"
                :placeholder="field.placeholder"
                :disabled="block.key === 'delivery' && sameAsBilling"
              />
            </UiFormField>
          </div>
        </div>

        <div>
          <p :class="BLOCK_TITLE">Delivery preferences</p>
          <div class="grid grid-cols-1 gap-x-6 gap-y-4">
            <UiFormField
              label="Preferred run"
              input-id="ac-pref"
            >
              <VoltSelect
                id="ac-pref"
                v-model="form.pref"
                :options="[...PREFERRED_RUNS]"
              />
            </UiFormField>

            <UiFormField
              label="Site notes"
              input-id="ac-notes"
            >
              <VoltTextarea
                id="ac-notes"
                v-model="form.notes"
                rows="3"
                placeholder="Access, gates, bin location, or anything the delivery team should know."
              />
            </UiFormField>
          </div>
        </div>

        <p
          v-if="saved"
          class="text-muted text-sm"
        >
          Saved.
        </p>
        <p
          v-if="failure"
          class="text-badge text-sm font-medium"
        >
          {{ failure }}
        </p>
      </div>
    </div>

    <!-- Save bar appears only while there are unsaved edits (design `.acct-savebar.show`). -->
    <div
      v-if="dirty"
      class="border-line flex flex-none flex-wrap items-center gap-4 border-t bg-surface p-4 sm:px-6"
    >
      <p class="text-sm font-semibold max-[640px]:basis-full">You have unsaved changes</p>
      <div class="ml-auto flex gap-3 max-[640px]:ml-0 max-[640px]:w-full">
        <VoltButton
          severity="secondary"
          class="max-[640px]:flex-1 max-[640px]:justify-center"
          @click="discard"
        >
          Discard
        </VoltButton>
        <VoltButton
          :loading="saving"
          class="max-[640px]:flex-1 max-[640px]:justify-center"
          @click="save"
        >
          Save changes
        </VoltButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiProfile, ProfileUpdateResponse } from '#shared/types/account'
import { PREFERRED_RUNS } from '~/features/auth/schemas/auth'

// Design `#pane-profile`: contact, billing, delivery and preferences, with a save
// bar that only appears once something changed. Saving PATCHes /user/info; the
// baseline is whatever the server last confirmed.
const props = defineProps<{ profile: ApiProfile }>()
const emit = defineEmits<{ saved: [] }>()

const api = useApi()

type ProfileKey = keyof ApiProfile

interface Field {
  name: ProfileKey
  label: string
  type?: string
  placeholder?: string
  full?: boolean
}

const BLOCK_TITLE = 'text-muted mb-4 text-xs font-semibold tracking-[0.12em] uppercase'

const BLOCKS: { key: string; title: string; fields: Field[] }[] = [
  {
    key: 'contact',
    title: 'Contact',
    fields: [
      { name: 'name', label: 'Full name' },
      { name: 'farm', label: 'Farm / business' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'tel' },
    ],
  },
  {
    key: 'billing',
    title: 'Billing address',
    fields: [
      { name: 'bill_addr1', label: 'Address line 1' },
      { name: 'bill_addr2', label: 'Address line 2', placeholder: 'Suite, unit, or gate code' },
      { name: 'bill_city', label: 'City' },
      { name: 'bill_prov', label: 'Province' },
      { name: 'bill_postal', label: 'Postal code' },
    ],
  },
  {
    key: 'delivery',
    title: 'Delivery address',
    fields: [
      { name: 'ship_contact', label: 'Delivery contact' },
      { name: 'ship_phone', label: 'Delivery phone', type: 'tel' },
      { name: 'ship_addr1', label: 'Address line 1' },
      { name: 'ship_addr2', label: 'Address line 2', placeholder: 'Gate, landmark, or lot note' },
      { name: 'ship_city', label: 'City' },
      { name: 'ship_prov', label: 'Province' },
      { name: 'ship_postal', label: 'Postal code' },
    ],
  },
]

const baseline = ref({ ...props.profile })
const form = ref({ ...props.profile })
const sameAsBilling = ref(false)
const saved = ref(false)
const saving = ref(false)
const failure = ref('')

// A refresh after saving (or switching account) re-seeds both copies.
watch(
  () => props.profile,
  (profile) => {
    baseline.value = { ...profile }
    form.value = { ...profile }
  },
)

const dirty = computed(() =>
  (Object.keys(form.value) as ProfileKey[]).some((key) => form.value[key] !== baseline.value[key]),
)

// Ticking "same as billing" mirrors the billing address into the delivery fields.
watch(sameAsBilling, (same) => {
  if (!same) {
    return
  }

  form.value.ship_addr1 = form.value.bill_addr1
  form.value.ship_addr2 = form.value.bill_addr2
  form.value.ship_city = form.value.bill_city
  form.value.ship_prov = form.value.bill_prov
  form.value.ship_postal = form.value.bill_postal
})

const discard = () => {
  form.value = { ...baseline.value }
  sameAsBilling.value = false
  saved.value = false
}

const save = async () => {
  saving.value = true
  failure.value = ''

  try {
    const { profile } = await api<ProfileUpdateResponse>('/user/info', {
      method: 'PATCH',
      body: form.value,
    })
    baseline.value = { ...profile }
    form.value = { ...profile }
    saved.value = true
    emit('saved')
  } catch (error) {
    failure.value = apiMessage(error, 'Could not save your changes.')
  } finally {
    saving.value = false
  }
}

watch(
  form,
  () => {
    saved.value = false
  },
  { deep: true },
)
</script>
