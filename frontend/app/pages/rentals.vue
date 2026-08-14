<template>
  <div>
    <InfoHero
      :title="page?.title ?? ''"
      :paragraphs="page?.paragraphs ?? []"
      :items="page?.items ?? []"
      :image="page?.image ?? ''"
      :image-alt="page?.imageAlt ?? ''"
    >
      <template #actions>
        <VoltButton to="/contact">
          Contact Us
          <UiGlyph
            name="arrow-right"
            class="text-[16px]"
          />
        </VoltButton>
        <!-- The design ships a placeholder price list (a JPEG opened as a blob).
             Point this at the real PDF once it exists. -->
        <VoltButton
          href="/images/rental-price-list.jpg"
          target="_blank"
          rel="noopener"
          severity="secondary"
        >
          Rental Price List
          <span
            class="sl-icon"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="square"
              stroke-linejoin="miter"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
        </VoltButton>
      </template>
    </InfoHero>

    <UiCtaBanner
      title="Need a machine for the job?"
      subtitle="Call the yard and we’ll set you up."
      label="Contact Us"
      to="/contact"
    />
  </div>
</template>

<script setup lang="ts">
import type { InfoPageResponse } from '#shared/types/content'

const api = useApi()

const { data: page } = await useAsyncData('page-rentals', () =>
  api<InfoPageResponse>('/pages/rentals'),
)

useHead({ title: 'Rentals' })
useSeoMeta({
  description:
    'Well-maintained equipment for rent at Thornloe Farm Supply — compact tractors, tillers, wood chipper, lawn roller and more.',
})
</script>
