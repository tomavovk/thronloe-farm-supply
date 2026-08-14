<template>
  <PageHero
    kicker="Feed · Farm Supply · Equipment · Service · Rentals · Tires"
    kicker-icon="leaf"
    title="All things farming,"
    title-soft="under one roof."
    :sub-lines="[
      'A local, family-run supply yard —',
      'feed and farm supplies, equipment sales and service, and tires.',
    ]"
    note="Thornloe, Ontario · serving the greater Timiskaming area."
    image="/images/home-hero-image.jpg"
    image-alt="Thornloe Farm Supply yard"
    :chips="CHIPS"
  >
    <template #actions>
      <VoltButton to="/shop">
        Shop Now
        <UiGlyph
          name="arrow-right"
          class="text-[16px]"
        />
      </VoltButton>
    </template>

    <!-- Delivery status card — home only. -->
    <template #overlay>
      <div
        class="border-line absolute bottom-[8%] left-[6%] w-[min(320px,80%)] border bg-surface px-6 pt-4 pb-6 text-sm"
      >
        <div class="border-line text-muted mb-3 border-b pb-3 text-xs">
          Order #1042 · Thornloe yard
        </div>
        <div class="mb-0.5 font-semibold">Bulk feed · 12 bags</div>
        <div class="text-muted mb-4 flex items-center gap-2 text-sm">
          <SlIcon
            name="transfer-truck-time"
            class="text-[13px]"
          />
          Out for delivery — Thu, 9 am
        </div>
        <div class="relative h-0.5 bg-panel">
          <span class="absolute top-0 bottom-0 left-0 w-[70%] bg-[image:var(--grad-accent)]" />
        </div>
      </div>
    </template>
  </PageHero>
</template>

<script setup lang="ts">
import type { HeroChip } from '~/features/content/components/PageHero.vue'

const CHIPS: HeroChip[] = [
  {
    title: 'T-Posts 6 ft',
    meta: 'In stock · Aisle 4',
    image: '/images/tpost.png',
    imageAlt: 'T-Post',
  },
  {
    title: 'Layer Feed 25 kg',
    meta: 'Back in stock',
    image: '/images/feed-bag.png',
    imageAlt: 'Layer feed bag',
  },
]
</script>
