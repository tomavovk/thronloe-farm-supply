<template>
  <SelectButton
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
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
  </SelectButton>
</template>

<script setup lang="ts">
import SelectButton, {
  type SelectButtonPassThroughOptions,
  type SelectButtonProps,
} from 'primevue/selectbutton'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ SelectButtonProps {}
defineProps<Props>()

// The design's chip row — `.shop-tag` (shop facet quick-picks) and `.pdp-opt`
// (product variants) are the same control: separate square boxes that wrap, a
// line border that turns brand-red on hover, and brand border + text when picked.
// Deliberately NOT a segmented control: no joined edges, no inner pill.
const theme = ref<SelectButtonPassThroughOptions>({
  root: `inline-flex flex-wrap gap-2`,
  pcToggleButton: {
    root: `relative inline-flex cursor-pointer select-none items-center justify-center
        border border-line bg-surface
        px-[1.1rem] py-[0.55rem]
        text-sm font-semibold text-muted
        hover:border-brand hover:text-brand
        p-checked:border-brand p-checked:text-brand
        disabled:pointer-events-none disabled:opacity-45
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
        transition-[color,border-color,background-color] duration-[350ms]`,
    content: `inline-flex items-center gap-2`,
    icon: `shrink-0`,
    label: ``,
  },
})
</script>
