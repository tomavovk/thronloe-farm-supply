<template>
  <section class="pb-8">
    <div class="container-page">
      <div class="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div class="pt-10">
          <h1 class="mb-4 text-3xl font-semibold">
            {{ title }}
          </h1>

          <p
            v-for="paragraph in paragraphs"
            :key="paragraph"
            class="text-muted mb-4 max-w-[56ch] last:mb-8"
          >
            {{ paragraph }}
          </p>

          <div
            v-if="items.length"
            class="grid grid-cols-2 gap-4 self-start"
          >
            <div
              v-for="item in items"
              :key="item.label"
              class="border-line hover:border-brand hover:text-brand flex items-center gap-3 border bg-panel px-4 py-3 text-base font-semibold transition-[color,border-color] duration-[350ms]"
            >
              <span
                class="flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden bg-panel"
              >
                <NuxtImg
                  :src="item.image"
                  format="webp"
                  alt=""
                  width="68"
                  height="68"
                  class="block h-full w-full object-contain"
                />
              </span>
              {{ item.label }}
            </div>
          </div>

          <slot name="after-list" />

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <slot name="actions" />
          </div>
        </div>

        <div class="aspect-[4/3] h-full min-h-[320px] w-full overflow-hidden bg-panel">
          <NuxtImg
            :src="image"
            format="webp"
            :alt="imageAlt"
            width="800"
            height="600"
            class="block h-full w-full object-cover"
          />
        </div>
      </div>

      <slot name="footer" />
    </div>
  </section>
</template>

<script setup lang="ts">
// Design `.info-hero` — the shared shape of the Rentals, Service and Tires pages:
// copy plus a bordered two-column list on the left, a 4:3 photo on the right, and
// page-specific actions/brand strips through slots.
withDefaults(
  defineProps<{
    title: string
    paragraphs: string[]
    image: string
    imageAlt: string
    items?: { label: string; image: string }[]
  }>(),
  { items: () => [] },
)
</script>
