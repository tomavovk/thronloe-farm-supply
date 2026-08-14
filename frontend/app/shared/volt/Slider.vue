<template>
  <Slider
    ref="el"
    unstyled
    :pt="theme"
    :ptOptions="{ mergeProps: ptViewMerge }"
  />
</template>

<script setup lang="ts">
import Slider, { type SliderPassThroughOptions, type SliderProps } from 'primevue/slider'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ SliderProps {}
defineProps<Props>()

const theme = ref<SliderPassThroughOptions>({
  root: `relative flex items-center select-none touch-none
    w-full h-5 cursor-pointer`,
  range: `absolute h-2 rounded-full
    bg-brand-500 `,
  handle: `block w-5 h-5 rounded-full -translate-x-1/2
    bg-white border-2 border-brand-500
    shadow-sm shadow-stone-200
    transition-colors duration-100 outline-none
    hover:border-brand-600
    focus-visible:ring-2 focus-visible:ring-brand-500/40 `,
})

const el = ref()
defineExpose({ el })
</script>
