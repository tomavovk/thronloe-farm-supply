<template>
  <Button
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
  </Button>
</template>

<script setup lang="ts">
import Button, { type ButtonPassThroughOptions, type ButtonProps } from 'primevue/button'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ ButtonProps {}
defineProps<Props>()

// The design's `.util-btn`: a 42px square, frameless until hover, then panel tint
// with a brand-red glyph. Used for the header's icon buttons and for the close
// controls inside Volt's own Dialog / Drawer / DataTable / Paginator.
const theme = ref<ButtonPassThroughOptions>({
  root: `relative inline-flex cursor-pointer select-none items-center justify-center gap-2
        h-[42px] min-w-[42px] px-2
        bg-transparent border border-transparent
        text-ink text-sm font-medium
        enabled:hover:bg-panel enabled:hover:text-brand
        p-icon-only:w-[42px] p-icon-only:px-0 p-icon-only:gap-0
        disabled:pointer-events-none disabled:opacity-45
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
        transition-[background-color,color] duration-[350ms]`,

  label: ``,
  icon: `shrink-0`,
  loadingIcon: `shrink-0 animate-spin`,
})
</script>
