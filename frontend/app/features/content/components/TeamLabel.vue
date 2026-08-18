<template>
  <p
    class="text-lg font-semibold tracking-[-0.01em]"
    :class="role && 'mb-0.5'"
  >
    {{ name }}
  </p>
  <p
    v-if="role"
    class="text-muted text-sm"
  >
    {{ role }}
  </p>
</template>

<script setup lang="ts">
// The name under a photo, with a job title where there is one — the crew cards
// carry both, the family shot only the name. One component because the two sat
// apart and drifted: the caption had picked up the muted body style while the
// cards kept the design's `.team-name`/`.team-role`. Alignment stays with the
// caller — the family shot centres, the cards don't.
defineProps<{ name: string; role?: string }>()
</script>
