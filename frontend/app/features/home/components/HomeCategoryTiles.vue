<template>
  <section class="py-24">
    <div class="container-page">
      <div class="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h2 class="text-xl font-semibold">Shop by Category</h2>
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/categories"
            class="hover:text-ink inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-[350ms] hover:underline hover:underline-offset-4"
          >
            View all
            <UiGlyph
              name="arrow-right"
              class="text-[14px]"
            />
          </NuxtLink>
          <UiCarouselNav
            v-show="overflows"
            label="categories"
            @prev="prev"
            @next="next"
          />
        </div>
      </div>

      <div
        ref="track"
        :class="TRACK"
      >
        <NuxtLink
          v-for="tile in HOME_TILES"
          :key="tile.label"
          :to="tile.to"
          :class="TILE"
          :style="tile.art ? undefined : { backgroundImage: `url('${tile.image}')` }"
        >
          <!-- Product-shot tiles show the image contained in a window instead of
               bleeding it as a cover background (design `.tile-slot`). -->
          <span
            v-if="tile.art"
            class="absolute top-[14%] right-[22%] bottom-[30%] left-[22%] block"
          >
            <NuxtImg
              :src="tile.image"
              format="webp"
              :alt="tile.label"
              class="h-full w-full object-contain"
            />
          </span>
          <!-- Explicit `text-ink`: these labels sit inside an <a>, which base.css
               paints brand-red (the design neutralises it with `color: inherit`
               on the card and `--color-text` on the label). -->
          <span
            class="text-ink group-hover:text-brand relative text-base font-semibold transition-colors duration-[350ms]"
          >
            {{ tile.label }}
          </span>
        </NuxtLink>
      </div>

      <UiCarouselProgress :fill-style="fillStyle" />
    </div>
  </section>
</template>

<script setup lang="ts">
// Design `home-categories`: a scroll-snap row of 4:3 tiles — most are a cover
// photo, two are product shots on the panel background.
const { track, overflows, fillStyle, prev, next } = useCarousel()

const TRACK =
  'flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none -mx-4 px-4 scroll-px-4 lg:-mx-[60px] lg:px-[60px] lg:scroll-px-[60px]'

const TILE =
  'group border-line relative flex aspect-[4/3] shrink-0 basis-[86%] snap-start items-end overflow-hidden border bg-panel bg-cover bg-center p-6 sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-3*1rem)/4)]'

const HOME_TILES = [
  { label: 'Feed', to: '/shop?category=Feed', image: '/images/cat-livestock-feed-2.png' },
  {
    label: 'Farm Supply',
    to: '/shop?category=Farm+Supply',
    image: '/images/cat-barn-frame-3.png',
  },
  {
    label: 'Chick Orders',
    to: '/shop?category=Field+%26+Yard&sub=Chick+Orders',
    image: '/images/cat-chicks.png',
    art: true,
  },
  {
    label: 'Fencing & Gates',
    to: '/shop?category=Field+%26+Yard&sub=Fencing+%26+Gates',
    image: '/images/cat-fencing-2.png',
  },
  {
    label: 'Seed',
    to: '/shop?category=Field+%26+Yard&sub=Seed',
    image: '/images/cat-garden-2.png',
  },
  { label: 'Equipment', to: '/shop?category=Equipment', image: '/images/cat-tools-2.png' },
  { label: 'Rentals', to: '/rentals', image: '/images/cat-trailer-2.png' },
  {
    label: 'Service & Tires',
    to: '/tires',
    image: '/images/home-categories-tile-8-art.png',
    art: true,
  },
]
</script>
