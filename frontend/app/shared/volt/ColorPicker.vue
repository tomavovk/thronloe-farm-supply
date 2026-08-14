<template>
  <ColorPicker
    unstyled
    :pt="theme"
    :ptOptions="{ mergeProps: ptViewMerge }"
  >
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}"
      />
    </template>
  </ColorPicker>
</template>

<script setup lang="ts">
import ColorPicker, {
  type ColorPickerPassThroughOptions,
  type ColorPickerProps,
} from 'primevue/colorpicker'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ ColorPickerProps {}
defineProps<Props>()

const theme = ref<ColorPickerPassThroughOptions>({
  root: `inline-block relative
    p-disabled:pointer-events-none p-disabled:opacity-50`,

  preview: `appearance-none cursor-pointer
    w-9 h-9 rounded-full
    border border-stone-200
    enabled:hover:border-stone-300
    focus:outline-none focus:ring-2 focus:ring-stone-900/20
    transition-[border-color,box-shadow] duration-150
    p-small:w-8 p-small:h-8
    p-large:w-11 p-large:h-11`,

  overlay: `absolute z-50 mt-2 p-3 rounded-2xl
    border border-stone-200
    bg-white
    shadow-lg shadow-stone-200/40
    p-inline:relative p-inline:mt-0 p-inline:shadow-none p-inline:p-0`,

  content: `flex items-start gap-2`,

  // Saturation / Value square — PrimeVue hard-codes 150×150 in JS for the
  // pickColor / handle position math, so we must match exactly.
  colorSelector: `relative w-37.5 h-37.5 rounded-xl overflow-hidden cursor-crosshair shrink-0`,
  colorBackground: `absolute inset-0
    [background:linear-gradient(to_top,rgba(0,0,0,1),rgba(0,0,0,0)),linear-gradient(to_right,rgba(255,255,255,1),rgba(255,255,255,0))]`,
  colorHandle: `absolute w-3 h-3 -ml-1.5 -mt-1.5
    rounded-full border-2 border-white shadow-md
    cursor-pointer`,

  // Hue strip — also 150px tall. Gradient is INVERTED (red at top = h=360,
  // red at bottom = h=0) because PrimeVue's handle uses `150 - 150 * h/360`.
  hue: `relative w-3 h-37.5 rounded-xl overflow-hidden cursor-pointer shrink-0
    [background:linear-gradient(to_bottom,#ff0000_0%,#ff00ff_17%,#0000ff_33%,#00ffff_50%,#00ff00_67%,#ffff00_83%,#ff0000_100%)]`,
  hueHandle: `absolute left-0 right-0 -mt-1 h-2
    border-2 border-white rounded-lg shadow-md
    cursor-row-resize pointer-events-none`,
})
</script>
