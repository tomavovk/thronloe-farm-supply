<template>
  <div class="flex items-start justify-center px-4 py-8 sm:py-16">
    <div
      class="w-full"
      :class="wide ? 'max-w-[720px]' : 'max-w-[420px]'"
    >
      <p
        v-if="kicker"
        class="border-line text-muted mb-6 inline-flex items-center gap-[7px] border bg-panel px-3 py-[5px] text-xs font-medium"
      >
        {{ kicker }}
      </p>

      <slot name="icon" />

      <h1 class="text-2xl font-semibold tracking-[-0.01em]">
        {{ title }}
      </h1>
      <p class="text-muted mt-2 max-w-[52ch] text-sm">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>

      <div class="mt-8 flex flex-col gap-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Design `.auth` / `.auth-card` — the frame shared by sign-in, registration and
// the two password steps. `wide` is the register card (720px instead of 420px).
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    kicker?: string
    wide?: boolean
  }>(),
  { wide: false },
)
</script>
