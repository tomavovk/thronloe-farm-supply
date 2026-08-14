<template>
  <InputNumber
    unstyled
    :pt="theme"
    :ptOptions="{ mergeProps: ptViewMerge }"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </InputNumber>
</template>

<script setup lang="ts">
import InputNumber, { type InputNumberPassThroughOptions, type InputNumberProps } from 'primevue/inputnumber'
import { computed } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ InputNumberProps {
  display?: boolean
}
const props = defineProps<Props>()

const theme = computed<InputNumberPassThroughOptions>(() => {
  if (props.display) {
    return {
      root: `inline-flex p-fluid:flex
        bg-stone-100
        rounded-xl border border-transparent`,

      pcInputText: {
        root: `appearance-none outline-none flex-1 min-w-0
          bg-transparent border-none px-3
          text-3xl font-bold text-stone-900 tabular-nums
          disabled:pointer-events-none`,
      },

      buttonGroup: `flex flex-col border-l border-stone-200 `,

      incrementButton: `flex items-center justify-center flex-1 w-7 px-0
        text-stone-400
        hover:text-stone-700
        hover:bg-stone-100
        active:bg-stone-200
        border-b border-stone-200
        rounded-tr-xl
        transition-colors duration-100 cursor-pointer`,

      incrementIcon: `w-3 h-3`,

      decrementButton: `flex items-center justify-center flex-1 w-7 px-0
        text-stone-400
        hover:text-stone-700
        hover:bg-stone-100
        active:bg-stone-200
        rounded-br-xl
        transition-colors duration-100 cursor-pointer`,

      decrementIcon: `w-3 h-3`,
    }
  }

  return {
    root: `inline-flex p-fluid:flex
      bg-stone-100
      border border-transparent rounded-full
      hover:border-stone-300
      focus-within:border-stone-400
      focus-within:ring-2 focus-within:ring-stone-900/20
      disabled:opacity-50 disabled:pointer-events-none
      [&.p-invalid:not(:focus-within)]:border-red-400
      transition-[border-color,box-shadow] duration-150`,

    pcInputText: {
      root: `appearance-none outline-none flex-1 min-w-0
        h-9 px-4
        bg-transparent border-none
        text-sm text-stone-900
        placeholder:text-stone-400
        [.p-invalid_&]:placeholder:text-red-400
        disabled:pointer-events-none`,
    },

    buttonGroup: `flex flex-col border-l border-stone-200 `,

    incrementButton: `flex items-center justify-center flex-1 w-7 px-0
      text-stone-400
      hover:text-stone-700
      hover:bg-stone-200
      active:bg-stone-300
      border-b border-stone-200
      rounded-tr-full
      transition-colors duration-100 cursor-pointer`,

    incrementIcon: `w-3 h-3`,

    decrementButton: `flex items-center justify-center flex-1 w-7 px-0
      text-stone-400
      hover:text-stone-700
      hover:bg-stone-200
      active:bg-stone-300
      rounded-br-full
      transition-colors duration-100 cursor-pointer`,

    decrementIcon: `w-3 h-3`,
  }
})
</script>
