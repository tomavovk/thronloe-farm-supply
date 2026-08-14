<template>
  <div class="flex gap-2">
    <button
      :class="BTN"
      :aria-label="`Previous ${label}`"
      @click="emit('prev')"
    >
      <UiGlyph
        name="arrow-left"
        class="text-[16px]"
      />
    </button>
    <button
      :class="BTN"
      :aria-label="`Next ${label}`"
      @click="emit('next')"
    >
      <UiGlyph
        name="arrow-right"
        class="text-[16px]"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
// Design `.carousel-nav` / `.carousel-btn` — shared by the category tiles,
// Featured and Deals carousels.
defineProps<{ label: string }>()
const emit = defineEmits<{ prev: []; next: [] }>()

const BTN =
  'border-line text-ink hover:border-brand hover:text-brand flex h-[42px] w-[42px] items-center justify-center border bg-surface transition-[color,border-color,background-color] duration-[350ms]'
</script>
