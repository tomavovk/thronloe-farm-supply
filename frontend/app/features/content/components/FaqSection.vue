<template>
  <section :class="['py-24', tight && 'pt-8']">
    <div class="container-page grid lg:grid-cols-12 lg:gap-4">
      <div class="mb-12 flex flex-col items-center text-center lg:col-span-8 lg:col-start-3">
        <p
          class="border-line text-muted mb-6 inline-flex items-center gap-[7px] border bg-panel px-3 py-[5px] text-xs leading-[1.4] font-medium"
        >
          <SlIcon
            name="help-chat-2"
            class="text-[13px]"
          />
          {{ kicker }}
        </p>
        <h2 class="mb-4 text-2xl font-medium tracking-[-0.01em]">
          {{ title }}
        </h2>
        <p class="text-muted text-sm">
          {{ subtitle }}
        </p>
      </div>

      <!-- Single-open accordion: opening one closes the others (PrimeVue's default). -->
      <VoltAccordion class="lg:col-span-8 lg:col-start-3">
        <VoltAccordionPanel
          v-for="(item, index) in items"
          :key="item.question"
          :value="String(index)"
        >
          <VoltAccordionHeader>{{ item.question }}</VoltAccordionHeader>
          <VoltAccordionContent>{{ item.answer }}</VoltAccordionContent>
        </VoltAccordionPanel>
      </VoltAccordion>
    </div>
  </section>
</template>

<script setup lang="ts">
// Design `.faq-section` — the same block on the home page ("Everything you're
// wondering") and on Contact ("Quick answers"); Contact tightens the top padding.
import type { FaqResponse } from '#shared/types/content'

const props = withDefaults(
  defineProps<{
    kicker: string
    title: string
    subtitle: string
    /** Which set to load from GET /faq?scope= */
    scope: 'home' | 'contact'
    tight?: boolean
  }>(),
  { tight: false },
)

const api = useApi()

const { data } = await useAsyncData(
  () => `faq-${props.scope}`,
  () => api<FaqResponse>('/faq', { query: { scope: props.scope } }),
)

const items = computed(() => data.value?.items ?? [])
</script>
