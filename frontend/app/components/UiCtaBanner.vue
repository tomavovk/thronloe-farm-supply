<template>
  <section>
    <div class="container-page">
      <div
        class="relative overflow-hidden bg-[image:var(--grad-accent)] px-8 py-16 lg:px-12 lg:py-24"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 right-[4%] -translate-y-1/2 text-[clamp(10rem,24vw,22rem)] leading-none font-semibold text-white/10 select-none"
        >
          T
        </span>
        <h2
          class="relative z-[1] mb-8 text-2xl leading-[1.25] font-medium tracking-[-0.01em] text-white"
        >
          {{ title }}
          <br />
          <span class="text-white/[0.72]">{{ subtitle }}</span>
        </h2>
        <VoltButton
          :to="to"
          :href="href"
          severity="contrast"
        >
          {{ label }}
          <UiGlyph
            :name="glyph"
            class="text-[16px]"
          />
        </VoltButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Design `.cta-banner` — the gradient closer with the oversized "T" watermark.
// Recurs on home, PDP and /categories; only the copy and the action differ (the
// categories one dials the store, hence `href` alongside `to`).
withDefaults(
  defineProps<{
    title: string
    subtitle: string
    label: string
    to?: string
    href?: string
    glyph?: 'arrow-right' | 'arrow-long'
  }>(),
  { glyph: 'arrow-right' },
)
</script>
