<template>
  <div>
    <section class="py-10">
      <div class="container-page">
        <div
          v-if="sectionName"
          class="text-muted mb-4 flex items-center gap-2 text-sm"
        >
          <NuxtLink
            to="/categories"
            class="text-muted hover:text-brand transition-colors duration-[350ms]"
          >
            All Categories
          </NuxtLink>
          <UiGlyph
            name="chevron-right"
            class="text-[14px]"
          />
          {{ sectionName }}
        </div>

        <h1 class="mb-4 text-3xl font-semibold">
          {{ sectionName ?? 'All Categories' }}
        </h1>

        <!-- Cards from the previous level stay put while the next one loads (dimmed),
             instead of flashing skeletons on every drill-down. -->
        <div
          class="mt-8 grid grid-cols-2 gap-6 [@media(min-width:901px)]:grid-cols-4"
          :class="pending && cards.length > 0 && 'opacity-60 transition-opacity'"
        >
          <template v-if="pending && !cards.length">
            <div
              v-for="n in 4"
              :key="n"
              class="border-line flex flex-col overflow-hidden rounded-[2px] border"
            >
              <div class="aspect-square w-full">
                <VoltSkeleton height="100%" />
              </div>
              <div class="border-line border-t p-4">
                <VoltSkeleton
                  width="60%"
                  height="1rem"
                />
              </div>
            </div>
          </template>

          <NuxtLink
            v-for="card in cards"
            v-else
            :key="card.name"
            :to="card.to"
            aria-current-value="false"
            class="border-line text-ink hover:border-brand flex flex-col overflow-hidden rounded-[2px] border bg-surface transition-[border-color,box-shadow] duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,.06)]"
          >
            <span class="flex aspect-square items-center justify-center bg-panel p-6">
              <NuxtImg
                :src="card.image"
                format="webp"
                :alt="card.name"
                width="320"
                height="320"
                class="h-full w-full object-contain"
              />
            </span>
            <span class="border-line flex items-baseline justify-between gap-3 border-t p-4">
              <span class="text-base font-semibold">{{ card.name }}</span>
              <span class="text-muted text-xs tabular-nums">{{ card.productCount }}</span>
            </span>
          </NuxtLink>
        </div>

        <BrandStrip />
      </div>
    </section>

    <UiCtaBanner
      title="Can’t find it in a category?"
      subtitle="Call the counter — we’ll order it in."
      :label="`Call ${site.phone}`"
      :href="site.phoneHref"
    />
  </div>
</template>

<script setup lang="ts">
import { breadcrumbSchema } from '~/shared/utils/schema'
import type { CategorySectionResponse } from '#shared/types/catalog'
import { shopSectionRoute } from '~/shared/constants/navigation'

// Two levels, as in the design — but on real URLs: the section grid at
// /categories, its leaf categories at /categories?section=Feed. Leaves hand off
// to the shop listing. Product counts come from the API.
const api = useApi()
const { site } = useSite()
const route = useRoute()

const sectionName = computed(() => (route.query.section as string) || null)

// One key for both levels: the section grid and a section's leaf categories are the
// same screen. The union has to be named explicitly — inferring it from the ternary
// leaves useAsyncData without a matching overload.
type CategoriesPayload = CategorySectionResponse | { sections: CategorySectionResponse[] }

const { data, pending } = await useAsyncData<CategoriesPayload>(
  () => `categories-${sectionName.value ?? 'root'}`,
  () =>
    sectionName.value
      ? api<CategorySectionResponse>(`/categories/${encodeURIComponent(sectionName.value)}`)
      : api<{ sections: CategorySectionResponse[] }>('/categories'),
  // Lazy so arriving from another page shows the card skeletons; drilling down
  // keeps the level you were on and dims it (see the grid's :class below).
  { lazy: true },
)

const cards = computed(() => {
  const payload = data.value

  if (!payload) {
    return []
  }

  if ('subs' in payload) {
    return payload.subs.map((sub) => ({ ...sub, to: shopSectionRoute(sub.name) }))
  }

  return payload.sections.map((section) => ({
    ...section,
    to: { path: '/categories', query: { section: section.name } },
  }))
})

useJsonld(() =>
  breadcrumbSchema(
    sectionName.value
      ? [
          { name: 'All Categories', url: '/categories' },
          {
            name: sectionName.value,
            url: `/categories?section=${encodeURIComponent(sectionName.value)}`,
          },
        ]
      : [{ name: 'All Categories', url: '/categories' }],
  ),
)

useHead({ title: () => sectionName.value ?? 'All Categories' })
useSeoMeta({
  description: () =>
    sectionName.value
      ? `${sectionName.value} at Thornloe Farm Supply — browse the categories in this section.`
      : 'Browse every category at Thornloe Farm Supply — feed, farm supply, field & yard, equipment and rentals.',
})
</script>
