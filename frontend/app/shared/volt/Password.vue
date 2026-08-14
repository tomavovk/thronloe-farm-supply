<template>
  <Password
    unstyled
    toggleMask
    :pt="theme"
    :ptOptions="{ mergeProps: ptViewMerge }"
  >
    <template #maskicon="{ toggleCallback }">
      <button
        type="button"
        :class="iconBtnClass"
        aria-label="Hide password"
        @click="toggleCallback"
      >
        <UiGlyph
          name="eye-off"
          class="text-[16px]"
        />
      </button>
    </template>
    <template #unmaskicon="{ toggleCallback }">
      <button
        type="button"
        :class="iconBtnClass"
        aria-label="Show password"
        @click="toggleCallback"
      >
        <UiGlyph
          name="eye"
          class="text-[16px]"
        />
      </button>
    </template>
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}"
      />
    </template>
  </Password>
</template>

<script setup lang="ts">
import Password, {
  type PasswordPassThroughOptions,
  type PasswordProps,
} from 'primevue/password'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ PasswordProps {}
defineProps<Props>()

const iconBtnClass =
  'absolute inset-y-0 right-3 flex cursor-pointer items-center justify-center text-muted hover:text-ink transition-colors duration-200'

// The field itself matches InputText (the design's `.co-field input`); only the
// trailing room for the reveal button is extra.
const theme = ref<PasswordPassThroughOptions>({
  root: `relative inline-flex w-full
    p-disabled:opacity-50 p-disabled:pointer-events-none`,

  pcInputText: {
    root: `w-full appearance-none outline-none
      border border-line
      px-3 py-[0.7rem] pe-10
      bg-surface
      text-sm font-normal text-ink text-ellipsis
      placeholder:text-subtle
      enabled:hover:border-brand
      enabled:focus:outline-2 enabled:focus:outline-brand enabled:focus:-outline-offset-1
      [&.p-invalid]:border-error
      transition-colors duration-[350ms]`,
  },

  // Feedback panel (strength meter + rules) — off by default in this app.
  overlay: `z-50 mt-1 min-w-64 border border-line bg-surface p-4 shadow-dropdown`,
  content: `flex flex-col gap-2`,
  meter: `relative h-2 overflow-hidden bg-panel`,
  // Strength is exposed as data-p="weak|medium|strong" on this element.
  meterLabel: `block h-full transition-[width,background-color] duration-200
    data-[p=weak]:bg-error
    data-[p=medium]:bg-amber-500
    data-[p=strong]:bg-success`,
  meterText: `text-muted text-xs`,
})
</script>
