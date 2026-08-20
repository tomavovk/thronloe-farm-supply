<template>
  <article class="group flex min-w-0 flex-col items-start">
    <NuxtLink
      :to="to"
      class="relative mb-4 aspect-square w-full overflow-hidden bg-panel"
      :aria-label="product.name"
    >
      <span
        v-if="product.badge"
        class="absolute top-2 left-2 z-[2] px-[0.4rem] py-[0.15rem] text-[11px] leading-[1.35] font-semibold tracking-[0.06em] text-white uppercase"
        :class="BADGE_BG[product.badge.kind]"
      >
        {{ product.badge.label }}
      </span>
      <NuxtImg
        :src="product.image"
        format="webp"
        :alt="product.name"
        width="600"
        height="600"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-[350ms] group-hover:scale-[1.03]"
      />
    </NuxtLink>

    <NuxtLink
      :to="to"
      class="text-ink mb-2 w-full overflow-hidden text-[16px] font-normal text-ellipsis whitespace-nowrap"
      :title="product.name"
    >
      <h3>{{ product.name }}</h3>
    </NuxtLink>

    <div
      v-if="variant === 'deal'"
      class="mb-4 flex w-full items-baseline gap-2"
    >
      <span class="text-ink text-[18px] font-semibold">{{ formatPrice(product.price) }}</span>
      <span class="text-muted text-sm line-through">{{ formatPrice(wasPrice) }}</span>
      <span class="text-badge ml-auto text-[11px] font-semibold tracking-[0.04em] uppercase">
        Save {{ formatPrice(wasPrice - product.price) }}
      </span>
    </div>
    <p
      v-else
      class="text-ink mb-4 text-[18px] font-semibold"
    >
      {{ formatPrice(product.price) }}
      <span
        v-if="rental"
        class="text-muted text-sm font-normal"
      >
        per day
      </span>
    </p>

    <p
      v-if="showStock && !rental && product.qty > 0"
      class="-mt-2 mb-3 text-xs"
      :class="product.qty <= 5 ? 'text-badge font-semibold' : 'text-muted'"
    >
      {{ product.qty <= 5 ? `Only ${product.qty} left` : `${product.qty} in stock` }}
    </p>

    <VoltButton
      v-if="showAction"
      :to="to"
      severity="secondary"
      size="sm"
    >
      More
    </VoltButton>
  </article>
</template>

<script setup lang="ts">
import type { ApiProduct, BadgeKind } from '#shared/types/catalog'

// Design `.product-card`. The badge and the stock count come from the API — the
// card only renders them. Two price layouts: a plain price (Featured, shop grid)
// and the deal row with was/save (Deals carousel).
//
// The design makes the whole card clickable via a `data-pdp` attribute; here the
// image and the title are the links instead. Wrapping the whole <article> in an
// anchor would nest the "More" link inside it, which is invalid HTML.
const props = withDefaults(
  defineProps<{
    product: ApiProduct
    variant?: 'price' | 'deal'
    showStock?: boolean
    showAction?: boolean
  }>(),
  { variant: 'price', showStock: false, showAction: false },
)

const BADGE_BG: Record<BadgeKind, string> = {
  sale: 'bg-badge',
  new: 'bg-ink',
  out: 'bg-muted',
}

// Rentals carry a rate card instead of one price, so the card headlines the day
// rate and leaves the stock count to the machines the store actually sells.
const rental = computed(() => isRental(props.product))

const to = computed(() => `/product/${props.product.id}`)
const wasPrice = computed(() => props.product.price * SALE_MARKUP)
</script>
