<template>
  <div>
    <InfoHero
      :title="page?.title ?? ''"
      :paragraphs="page?.paragraphs ?? []"
      :items="page?.items ?? []"
      :image="page?.image ?? ''"
      :image-alt="page?.imageAlt ?? ''"
    >
      <template #after-list>
        <p class="text-muted mt-8 mb-4 max-w-[56ch]">
          <strong class="text-ink font-semibold">Typical turnaround:</strong>
          farm tires 3–4 days · vehicle &amp; highway truck tires 1–2 days.
        </p>
        <p class="text-muted mb-4 max-w-[56ch]">
          <strong class="text-ink font-semibold">Spring &amp; fall tire changeover:</strong>
          call ahead to book your changeover. Fall bookings open early September; spring bookings
          open the beginning of April.
        </p>
      </template>

      <template #actions>
        <VoltButton :href="TIRE_REQUEST_MAILTO">
          Request Tires
          <UiGlyph
            name="arrow-right"
            class="text-[16px]"
          />
        </VoltButton>
      </template>

      <template #footer>
        <BrandStrip scope="tires" />
      </template>
    </InfoHero>

    <UiCtaBanner
      title="Need new tires or a repair?"
      subtitle="Call the yard and we’ll get you rolling."
      label="Request Tires"
      :href="TIRE_REQUEST_MAILTO"
    />
  </div>
</template>

<script setup lang="ts">
import type { InfoPageResponse } from '#shared/types/content'

import { TIRE_REQUEST_MAILTO } from '~/shared/constants/site'

const api = useApi()

const { data: page } = await useAsyncData('page-tires', () => api<InfoPageResponse>('/pages/tires'))

useHead({ title: 'Tires' })
useSeoMeta({
  description:
    'Tire sales and service at Thornloe Farm Supply — agricultural, industrial, passenger, light truck and highway truck tires, with on-site farm service.',
})
</script>
