<template>
  <div class="relative mt-6 h-0.5 bg-panel">
    <span
      class="absolute top-0 bottom-0 left-0 w-1/4 bg-[linear-gradient(90deg,oklch(0.58_0.2_25),oklch(0.66_0.19_28))] transition-[width,left] duration-[350ms]"
      :style="fillStyle"
    />
  </div>
</template>

<script setup lang="ts">
// Design `.tiles-progress` / `.tiles-progress-fill`: the fill's width is the
// visible fraction of the track and its offset tracks the scroll position —
// both computed by useCarousel().
defineProps<{ fillStyle: Record<string, string> }>()
</script>
