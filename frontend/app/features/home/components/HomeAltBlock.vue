<template>
  <section>
    <div class="container-page grid items-center gap-8 py-16 lg:grid-cols-12 lg:gap-4">
      <div
        class="aspect-[6/5] overflow-hidden lg:col-span-6"
        :class="flip ? 'lg:order-2 lg:col-start-7' : 'lg:col-start-1'"
      >
        <NuxtImg
          :src="image"
          format="webp"
          :alt="imageAlt"
          width="800"
          height="600"
          class="block h-full w-full object-cover"
        />
      </div>

      <div
        class="flex flex-col items-start lg:col-span-5"
        :class="flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'"
      >
        <p
          class="border-line text-muted mb-6 inline-flex items-center gap-[7px] border bg-panel px-3 py-[5px] text-xs leading-[1.4] font-medium"
        >
          <SlIcon
            :name="kickerIcon"
            class="text-[13px]"
          />
          {{ kicker }}
        </p>
        <h2 class="mb-3 text-xl font-semibold">
          {{ title }}
        </h2>
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DesignIcon } from '~/shared/constants/icons'

// Design `.alt-block` — the airy image/copy rows on the home and about pages.
// `flip` swaps the columns (design `.alt-block.flip`). Body content (paragraph,
// event pill, CTA) comes in through the default slot.
withDefaults(
  defineProps<{
    image: string
    imageAlt: string
    kicker: string
    kickerIcon: DesignIcon
    title: string
    flip?: boolean
  }>(),
  { flip: false },
)
</script>
