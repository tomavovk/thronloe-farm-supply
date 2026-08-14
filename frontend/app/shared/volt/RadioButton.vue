<template>
  <RadioButton unstyled :pt="theme" :ptOptions="{ mergeProps: ptViewMerge }" />
</template>

<script setup lang="ts">
import RadioButton, { type RadioButtonPassThroughOptions, type RadioButtonProps } from 'primevue/radiobutton'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ RadioButtonProps {}
defineProps<Props>()

const theme = ref<RadioButtonPassThroughOptions>({
  root: `inline-flex items-center cursor-pointer select-none
    has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50`,
  box: `w-4 h-4 rounded-full flex items-center justify-center shrink-0
    border border-stone-300
    bg-white
    transition-colors duration-200
    p-checked:border-stone-900
    p-invalid:border-red-500
    focus-within:ring-2 focus-within:ring-stone-950/20 `,
  input: `sr-only`,
  icon: `w-2 h-2 rounded-full bg-stone-900 opacity-0 p-checked:opacity-100 transition-none`,
})
</script>
