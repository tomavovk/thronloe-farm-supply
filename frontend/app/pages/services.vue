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
      </template>

      <template #footer>
        <BrandStrip scope="service" />
      </template>
    </InfoHero>

    <UiCtaBanner
      title="Machine down?"
      subtitle="Our service team is ready when you are."
      label="Contact Us"
      to="/contact"
    />
  </div>
</template>

<script setup lang="ts">
import type { InfoPageResponse } from '#shared/types/content'

const api = useApi()

const { data: page } = await useAsyncData('page-services', () =>
  api<InfoPageResponse>('/pages/services'),
)

useHead({ title: 'Service' })
useSeoMeta({
  description:
    'Farm equipment service and parts at Thornloe Farm Supply — manure and feeding equipment, augers, welding, overhead doors and farm machinery.',
})
</script>
