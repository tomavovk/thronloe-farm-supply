<template>
  <Checkbox
    unstyled
    :pt="theme"
    :ptOptions="{ mergeProps: ptViewMerge }"
  />
</template>

<script setup lang="ts">
import Checkbox, { type CheckboxPassThroughOptions, type CheckboxProps } from 'primevue/checkbox'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ CheckboxProps {}
defineProps<Props>()

// Design `.filter-list input`: a 15px square box, brand fill when checked
// (the design gets that from `accent-color`), square corners like everything else.
const theme = ref<CheckboxPassThroughOptions>({
  root: `relative inline-flex items-center cursor-pointer select-none
    has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50`,
  box: `w-[15px] h-[15px] flex items-center justify-center shrink-0
    border border-subtle
    bg-surface
    transition-colors duration-150
    p-checked:bg-brand p-checked:border-brand
    p-invalid:border-error
    focus-within:ring-2 focus-within:ring-brand/25`,
  input: `sr-only`,
  icon: `w-2.5 h-2.5 text-white opacity-0 p-checked:opacity-100 transition-none`,
})
</script>
