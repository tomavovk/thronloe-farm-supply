<template>
  <div>
    <section class="pb-8">
      <div class="container-page">
        <div class="max-w-[60ch] pt-10 pb-4">
          <p
            class="border-line text-muted mb-6 inline-flex items-center gap-[7px] border bg-panel px-3 py-[5px] text-xs leading-[1.4] font-medium"
          >
            <SlIcon
              name="calendar-mark"
              class="text-[13px]"
            />
            Events
          </p>
          <h1 class="mb-4 text-3xl font-semibold">What’s on at the yard</h1>
          <p class="text-muted mb-4 max-w-[56ch]">
            Two things fill our calendar: chick delivery dates through the season, and our annual
            Fur &amp; Feather customer appreciation day. Call the counter at
            <a
              :href="site.phoneHref"
              class="text-brand font-semibold"
            >
              {{ site.phone }}
            </a>
            to get your chick order in or to hear when the next date lands.
          </p>
        </div>
      </div>
    </section>

    <!-- Placeholder while /events loads: same alternating photo/copy rows, so the
         real events drop in without shifting the page. -->
    <template v-if="pending && !events.length">
      <section
        v-for="n in 2"
        :key="n"
      >
        <div class="container-page grid items-center gap-8 py-16 lg:grid-cols-12 lg:gap-4">
          <div
            class="lg:col-span-6"
            :class="n === 2 ? 'lg:order-2 lg:col-start-7' : 'lg:col-start-1'"
          >
            <div class="aspect-[6/5] w-full">
              <VoltSkeleton height="100%" />
            </div>
          </div>

          <div
            class="flex flex-col items-start gap-3 lg:col-span-5"
            :class="n === 2 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'"
          >
            <VoltSkeleton
              width="55%"
              height="1.75rem"
            />
            <VoltSkeleton height="1rem" />
            <VoltSkeleton
              width="82%"
              height="1rem"
            />
            <VoltSkeleton
              width="40%"
              height="1rem"
              class="mt-3"
            />
            <VoltSkeleton
              width="46%"
              height="1rem"
            />
            <VoltSkeleton
              width="140px"
              height="2.85rem"
              class="mt-4"
            />
          </div>
        </div>
      </section>
    </template>

    <section
      v-for="(event, index) in events"
      v-else
      :key="event.title + event.day"
    >
      <div class="container-page grid items-center gap-8 py-16 lg:grid-cols-12 lg:gap-4">
        <div
          class="relative aspect-[6/5] overflow-hidden lg:col-span-6"
          :class="index % 2 ? 'lg:order-2 lg:col-start-7' : 'lg:col-start-1'"
        >
          <NuxtImg
            :src="event.image"
            format="webp"
            :alt="event.imageAlt"
            width="800"
            height="600"
            class="block h-full w-full object-cover"
          />

          <!-- Date stamp + kind tag, pinned over the photo (design `.ev-stamp` / `.ev-tag`). -->
          <div
            class="border-line absolute top-4 left-4 flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 border bg-surface py-2 pr-3.5 pl-2"
          >
            <span
              class="text-muted inline-flex min-w-[58px] flex-col items-center justify-center bg-panel px-2.5 py-1.5 text-xs leading-[1.2] font-semibold tracking-[0.08em] uppercase"
            >
              {{ event.month }}
              <b class="text-ink text-lg font-semibold tracking-[-0.02em]">{{ event.day }}</b>
            </span>
            <span class="text-muted text-sm">{{ event.when }}</span>
          </div>
          <span
            class="border-line text-brand absolute right-4 bottom-4 inline-flex items-center gap-1.5 border bg-surface px-[11px] py-[7px] text-xs font-semibold tracking-[0.08em] uppercase"
          >
            {{ event.tag }}
          </span>
        </div>

        <div
          class="flex flex-col items-start lg:col-span-5"
          :class="index % 2 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'"
        >
          <h2 class="mb-3 text-xl font-semibold">
            {{ event.title }}
          </h2>
          <p class="text-muted mb-6 max-w-[44ch]">
            {{ event.text }}
          </p>

          <ul class="mb-6 flex max-w-[46ch] list-none flex-col gap-2">
            <li
              v-for="point in event.points"
              :key="point"
              class="text-muted relative pl-4 text-sm before:absolute before:top-[0.55em] before:left-0 before:h-px before:w-[7px] before:bg-brand before:content-['']"
            >
              {{ point }}
            </li>
          </ul>

          <div
            class="border-line mb-6 flex w-full max-w-[46ch] flex-wrap items-baseline gap-3 border-t pt-4"
          >
            <strong class="text-lg font-semibold tracking-[-0.02em]">{{ event.priceLabel }}</strong>
            <span class="text-muted text-sm">{{ event.priceNote }}</span>
          </div>

          <VoltButton
            to="/contact"
            :severity="event.ctaGhost ? 'secondary' : undefined"
          >
            {{ event.cta }}
            <UiGlyph
              name="arrow-right"
              class="text-[16px]"
            />
          </VoltButton>
        </div>
      </div>
    </section>

    <UiCtaBanner
      title="Want to hear about the next one first?"
      subtitle="We post dates at the counter and in the monthly flyer."
      label="Get in Touch"
      to="/contact"
    />
  </div>
</template>

<script setup lang="ts">
import type { EventsResponse } from '#shared/types/content'

const api = useApi()
const { site } = useSite()

// Lazy so a client-side nav shows the skeleton instead of holding the old page;
// SSR still renders the events in full for crawlers.
const { data, pending } = await useAsyncData('events', () => api<EventsResponse>('/events'), {
  lazy: true,
})

const events = computed(() => data.value?.items ?? [])

useHead({ title: 'Events' })
useSeoMeta({
  description:
    'Chick delivery dates and the annual Fur & Feather customer appreciation day at Thornloe Farm Supply.',
})
</script>
