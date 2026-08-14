<template>
  <div>
    <PageHero
      kicker="About Us"
      kicker-icon="store-2"
      title="A local yard,"
      title-soft="run by your neighbours."
      :sub-lines="[
        'We are a local Canadian business located in Thornloe, ON. Our team is committed to providing a reliable and trustworthy experience to our local community.',
      ]"
      note="From feed and farm supply to equipment sales and service, and even tires — we have you covered for all things farming."
      image="/images/about-hero-image.jpg"
      image-alt="Inside the Thornloe Farm Supply store"
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
    </PageHero>

    <!-- Meet the team -->
    <section class="py-24">
      <div class="container-page">
        <div class="mb-12 max-w-[64ch]">
          <h2 class="mt-3 mb-4 text-2xl leading-[1.1] font-medium tracking-[-0.01em]">
            Meet the team.
          </h2>
        </div>

        <div class="mb-16 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div class="lg:col-span-6">
            <div :class="[PLACEHOLDER, 'aspect-[4/3] text-[44px]']">
              <SlIcon name="user-single-neutral-male" />
            </div>
          </div>
          <div class="flex flex-col gap-4 lg:col-span-6">
            <p
              v-for="paragraph in about?.intro ?? []"
              :key="paragraph"
              class="text-muted max-w-[54ch] text-lg leading-[1.6]"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          <div
            v-for="member in about?.team ?? []"
            :key="member.name"
            class="flex flex-col"
          >
            <div :class="[PLACEHOLDER, 'mb-4 aspect-square text-[38px]']">
              <SlIcon name="user-single-neutral-male" />
            </div>
            <p class="mb-0.5 text-lg font-semibold tracking-[-0.01em]">
              {{ member.name }}
            </p>
            <p class="text-muted text-sm">
              {{ member.role }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Four trades -->
    <section class="py-24">
      <div class="container-page">
        <div class="mb-12 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
          <h2 class="text-2xl leading-[1.1] font-medium tracking-[-0.01em]">
            Four trades,
            <span class="text-ink-soft block">one gate to drive through.</span>
          </h2>
          <p class="text-muted max-w-[52ch]">
            Most farms juggle a feed mill, a dealer and a mechanic. Here it’s one counter: feed
            loaded the same day, equipment sold and set up, and a shop that keeps it turning — tires
            included.
          </p>
        </div>

        <div class="border-line grid grid-cols-1 border-t border-l md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="pillar in about?.pillars ?? []"
            :key="pillar.word"
            class="border-line flex flex-col border-r border-b p-6 md:min-h-[320px] md:p-8 lg:min-h-[340px]"
          >
            <span
              class="border-line text-muted mb-12 inline-flex items-center gap-[7px] self-start border bg-panel px-2.5 py-1.5 text-xs font-medium tracking-[0.08em] uppercase"
            >
              <SlIcon
                :name="pillar.icon as DesignIcon"
                class="text-[14px]"
              />
              {{ pillar.chip }}
            </span>
            <p
              class="mt-auto mb-4 text-[clamp(2rem,4vw,2.8rem)] leading-none font-medium tracking-[-0.03em]"
            >
              {{ pillar.word }}
            </p>
            <p class="text-muted max-w-[32ch] text-sm">
              {{ pillar.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <UiCtaBanner
      title="Come see us in Thornloe."
      :subtitle="`${site.addressLines[0]} · Mon–Sat`"
      label="Shop Now"
      to="/shop"
    />
  </div>
</template>

<script setup lang="ts">
import type { HeroChip } from '~/features/content/components/PageHero.vue'
import type { DesignIcon } from '~/shared/constants/icons'
import type { AboutResponse } from '#shared/types/content'

const api = useApi()
const { site } = useSite()

const { data: about } = await useAsyncData('page-about', () => api<AboutResponse>('/pages/about'))

const CHIPS: HeroChip[] = [
  {
    title: 'Thornloe, ON',
    meta: 'Since day one',
    image: '/images/feed-bag.png',
    imageAlt: 'Feed bag',
  },
  {
    title: 'Open Mon–Sat',
    meta: 'Counter & yard',
    image: '/images/tpost.png',
    imageAlt: 'T-Post',
  },
]

// Photos aren't shot yet; the design ships grey placeholder squares.
const PLACEHOLDER = 'border-line flex items-center justify-center border bg-panel text-[#cfcec6]'

useHead({ title: 'About Us' })
useSeoMeta({
  description:
    'Thornloe Farm Supply is a local, family-run business in Thornloe, Ontario — feed, farm supply, equipment sales and service, rentals and tires.',
})
</script>
