<template>
  <section class="relative overflow-hidden bg-surface">
    <div
      class="container-page grid items-end gap-8 pt-8 pb-12 lg:min-h-[64vh] lg:grid-cols-12 lg:gap-4 lg:pt-0 lg:pb-12"
    >
      <div class="lg:col-span-5 lg:pt-12">
        <p
          class="border-line text-muted mb-6 inline-flex items-center gap-[7px] border bg-panel px-3 py-[5px] text-xs leading-[1.4] font-medium"
        >
          <SlIcon
            :name="kickerIcon"
            class="text-[13px]"
          />
          {{ kicker }}
        </p>
        <h1 class="text-hero mb-4 max-w-[18ch]">
          {{ title }}
          <span class="text-ink-soft">{{ titleSoft }}</span>
        </h1>
        <p class="text-ink mb-4 max-w-[38ch] text-base">
          <template
            v-for="(line, i) in subLines"
            :key="line"
          >
            <br v-if="i" />
            {{ line }}
          </template>
        </p>
        <p class="text-muted mb-8 text-sm italic">
          {{ note }}
        </p>
        <slot name="actions" />
      </div>

      <div
        class="relative h-[360px] overflow-hidden lg:col-span-7 lg:h-auto lg:min-h-[62vh] lg:self-stretch"
      >
        <NuxtImg
          :src="image"
          format="webp"
          :alt="imageAlt"
          width="900"
          height="620"
          class="absolute inset-0 h-full w-full object-cover object-center"
        />
        <!-- Blurred copy of the same photo, masked to a soft vignette. Requested
             tiny on purpose: it's decorative and blurred 18px, so full resolution
             would be a second full-size download for nothing. -->
        <NuxtImg
          :src="image"
          format="webp"
          alt=""
          aria-hidden="true"
          width="240"
          height="165"
          class="pointer-events-none absolute inset-0 h-full w-full scale-[1.08] object-cover blur-[18px] [mask-image:radial-gradient(ellipse_70%_65%_at_center,transparent_40%,black_82%)]"
        />

        <div
          v-for="(chip, i) in chips"
          :key="chip.title"
          :class="[CHIP, i === 0 ? 'top-[10%] right-[8%]' : 'top-[calc(10%+66px)] right-[14%]']"
        >
          <span
            class="flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden bg-panel"
          >
            <NuxtImg
              :src="chip.image"
              format="webp"
              :alt="chip.imageAlt"
              width="34"
              height="34"
              class="h-full w-full object-contain"
            />
          </span>
          <strong class="font-semibold">{{ chip.title }}</strong>
          <em class="text-muted not-italic">{{ chip.meta }}</em>
        </div>

        <slot name="overlay" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DesignIcon } from '~/shared/constants/icons'

// Design `.hero` — used by the home page and About with different copy: kicker,
// two-tone title, sub, italic note and CTA on the left; a photo with a blurred
// vignette twin plus floating chips on the right. Extra overlays (home's delivery
// card) come in through the `overlay` slot.
export interface HeroChip {
  title: string
  meta: string
  image: string
  imageAlt: string
}

withDefaults(
  defineProps<{
    kicker: string
    kickerIcon: DesignIcon
    title: string
    titleSoft: string
    subLines: string[]
    note: string
    image: string
    imageAlt: string
    chips?: HeroChip[]
  }>(),
  { chips: () => [] },
)

const CHIP =
  'border-line absolute hidden items-center gap-2 border bg-surface py-1.5 pr-3 pl-1.5 text-sm whitespace-nowrap md:inline-flex'
</script>
