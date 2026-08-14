<template>
  <section class="py-24">
    <div class="container-page">
      <div class="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h2 class="text-xl font-semibold">
          {{ title }}
        </h2>
        <UiCarouselNav
          v-show="overflows"
          :label="label"
          @prev="prev"
          @next="next"
        />
      </div>

      <ProductGridSkeleton
        v-if="pending && !products.length"
        :count="4"
        grid-class="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4"
      />
      <div
        v-else
        ref="track"
        :class="TRACK"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :variant="variant"
          class="shrink-0 basis-[86%] snap-start sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-3*1rem)/4)]"
        />
      </div>

      <UiCarouselProgress
        v-show="overflows"
        :fill-style="fillStyle"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ApiProduct } from '#shared/types/catalog'

// Shared by the home page's two product rows (Featured, Deals at the Yard) —
// identical markup in the design, only the price layout differs.
defineProps<{
  title: string
  label: string
  products: ApiProduct[]
  variant?: 'price' | 'deal'
  pending?: boolean
}>()

const { track, overflows, fillStyle, prev, next } = useCarousel()

const TRACK =
  'flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none -mx-4 px-4 scroll-px-4 lg:-mx-[60px] lg:px-[60px] lg:scroll-px-[60px]'
</script>
