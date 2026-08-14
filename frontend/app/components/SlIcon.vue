<template>
  <span
    class="sl-icon"
    aria-hidden="true"
  >
    <Icon :name="`streamline-sharp:${name}`" />
  </span>
</template>

<script setup lang="ts">
import type { DesignIcon } from '~/shared/constants/icons'

// The design's icon set: Streamline Sharp, drawn at 1.35× stroke width. Both the
// sizing (1em box, driven by font-size) and the stroke scaling live in the
// `.sl-icon` rules in base.css, so callers only pass the icon name and — when it
// differs from the 19px default — a font-size class:
//   <SlIcon name="magnifying-glass" class="text-[17px]" />
defineProps<{ name: DesignIcon }>()
</script>
