<template>
  <div>
    <HomeHero />
    <HomeProductCarousel
      title="Deals at the Yard"
      label="deals"
      :products="deals"
      variant="deal"
      :pending="dealsPending"
    />

    <HomeProductCarousel
      title="Featured"
      label="featured"
      :products="featured"
      :pending="featuredPending"
    />
    <HomeCategoryTiles />

    <HomeAltBlock
      image="/images/home-about-image.jpg"
      image-alt="Inside the store"
      kicker="Our Store"
      kicker-icon="store-2"
      title="A local yard you can count on."
    >
      <p class="text-muted mb-6 max-w-[44ch]">
        A local Canadian business in Thornloe, ON. Our team is here to give the community a
        reliable, trustworthy place to buy — and if we don’t stock it, we’ll order it in.
      </p>
      <VoltButton
        to="/about"
        severity="secondary"
      >
        About Us
        <UiGlyph
          name="arrow-right"
          class="text-[16px]"
        />
      </VoltButton>
    </HomeAltBlock>

    <HomeAltBlock
      flip
      image="/images/home-services-image.jpg"
      image-alt="Delivery truck"
      kicker="Delivery"
      kicker-icon="transfer-truck-time"
      title="We’ll come to you."
    >
      <p class="text-muted mb-6 max-w-[44ch]">
        Delivery every Friday. Matheson runs the 1st &amp; 3rd Friday of the month; Thornloe and the
        local area the 2nd &amp; 4th. Store items are delivered only alongside a feed order, and
        minimum order quantities apply — give us a call to get on the run.
      </p>
      <VoltButton
        to="/shop"
        severity="secondary"
      >
        Shop Now
        <UiGlyph
          name="arrow-right"
          class="text-[16px]"
        />
      </VoltButton>
    </HomeAltBlock>

    <HomeAltBlock
      image="/images/home-events-image.jpg"
      image-alt="Chick delivery day"
      kicker="Events"
      kicker-icon="calendar-mark"
      title="Chick days and Fur &amp; Feather."
    >
      <div class="border-line mb-6 inline-flex items-center gap-4 border bg-surface px-6 py-4">
        <div
          class="border-line text-brand border-r pr-4 text-center text-xs leading-[1.1] font-medium tracking-[0.08em]"
        >
          AUG
          <span class="block text-xl tracking-normal">15</span>
        </div>
        <div class="flex flex-col gap-0.5 text-sm">
          <strong class="block font-semibold">Chick Delivery Day</strong>
          <em class="text-muted not-italic">Sat · Ready for pickup from 9 am · In-store</em>
        </div>
      </div>
      <VoltButton
        to="/events"
        severity="secondary"
      >
        All Events
        <UiGlyph
          name="arrow-right"
          class="text-[16px]"
        />
      </VoltButton>
    </HomeAltBlock>

    <HomeFaq />
    <UiCtaBanner
      title="Stock up for the season."
      subtitle="One yard, everything your farm needs."
      label="Shop Now"
      to="/shop"
    />
  </div>
</template>

<script setup lang="ts">
import { websiteSchema } from '~/shared/utils/schema'
import type { ProductListResponse } from '#shared/types/catalog'

// Featured and Deals draw from the same catalogue as the shop; the design picks
// them by badge (New → Featured, Sale → Deals at the Yard), which the listing
// endpoint exposes as `?badge=`.
const api = useApi()
const { site } = useSite()

const row = (badge: 'new' | 'sale') =>
  api<ProductListResponse>('/products', { query: { badge, limit: 12 } })

// Lazy on both rows: the hero and the category tiles are the page, the carousels
// sit below them, so they show skeletons instead of holding the whole route back.
// SSR still renders them in full.
const { data: featuredData, pending: featuredPending } = await useAsyncData(
  'home-featured',
  () => row('new'),
  { lazy: true },
)
const { data: dealsData, pending: dealsPending } = await useAsyncData(
  'home-deals',
  () => row('sale'),
  { lazy: true },
)

const featured = computed(() => featuredData.value?.items ?? [])
const deals = computed(() => dealsData.value?.items ?? [])

// The design's home page title carries no suffix.
useJsonld(() => websiteSchema())

useHead({ titleTemplate: '%s', title: () => site.value.name })

useSeoMeta({
  description:
    'Feed, farm supply, equipment sales and service, rentals and tires in Thornloe, Ontario — serving the greater Timiskaming area.',
})
</script>
