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
        <p class="text-muted mt-6 max-w-[56ch] text-sm">{{ RENTAL_DELIVERY_NOTE }}</p>
      </template>

      <template #actions>
        <VoltButton to="/contact">
          Contact Us
          <UiGlyph
            name="arrow-right"
            class="text-[16px]"
          />
        </VoltButton>
      </template>
    </InfoHero>

    <section class="pt-8 pb-24">
      <div class="container-page">
        <div
          class="border-line mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-6"
        >
          <span
            class="text-muted text-sm"
            aria-live="polite"
          >
            {{ countLabel }}
          </span>
          <!-- Width belongs on a wrapper: a fallthrough class on a Volt root isn't
               twMerged against the PT's own (see shared/volt/CLAUDE.md). -->
          <div class="w-full sm:w-[15rem]">
            <VoltSelect
              v-model="category"
              :options="categoryOptions"
              option-label="label"
              option-value="value"
              aria-label="Filter rentals by category"
            />
          </div>
        </div>

        <div
          class="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12"
        >
          <ShopFilters
            v-model:open="filtersOpen"
            v-model:sort="sort"
            v-model:brands="brands"
            v-model:facets="facets"
            :brand-options="brandOptions"
            :facet-options="typeOptions"
            :facet-title="facetTitle"
            :sort-options="RENTAL_SORT_OPTIONS"
            :show-availability="false"
            result-noun="machine"
            :result-count="total"
            @clear="clearFilters"
          />

          <div class="min-w-0">
            <div class="mb-6 flex items-center gap-3 lg:hidden">
              <VoltButton
                severity="secondary"
                aria-haspopup="dialog"
                @click="filtersOpen = true"
              >
                <UiGlyph name="funnel" />
                Filters
                <span
                  v-if="activeFilterCount"
                  class="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center bg-brand px-1.5 text-xs font-semibold text-white tabular-nums"
                >
                  {{ activeFilterCount }}
                </span>
              </VoltButton>
            </div>

            <!-- Re-filtering dims the fleet already on screen rather than flashing a
                 skeleton grid over it. -->
            <div :class="pending && groups.length > 0 && 'opacity-60 transition-opacity'">
              <div
                v-for="group in groups"
                :key="group.name"
                class="mt-16 first:mt-0"
              >
                <div class="border-line mb-8 flex flex-wrap items-baseline gap-4 border-b pb-4">
                  <h2 class="text-xl font-semibold">{{ group.name }}</h2>
                  <span class="text-muted text-sm">{{ machineCount(group.items.length) }}</span>
                </div>

                <div class="grid grid-cols-2 gap-x-4 gap-y-16 md:grid-cols-3">
                  <ProductCard
                    v-for="item in group.items"
                    :key="item.id"
                    :product="item"
                    show-action
                  />
                </div>
              </div>

              <p
                v-if="!groups.length"
                class="text-muted text-sm"
              >
                No machines match these filters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <UiCtaBanner
      title="Need a machine for the job?"
      subtitle="Call the yard and we’ll set you up."
      label="Contact Us"
      to="/contact"
    />
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import type { CategorySectionResponse, ProductListResponse } from '#shared/types/catalog'
import type { InfoPageResponse } from '#shared/types/content'
import {
  RENTAL_DELIVERY_NOTE,
  RENTAL_FLEET_LIMIT,
  RENTAL_SORT_OPTIONS,
  RENTALS_SECTION,
} from '~/shared/constants/rentals'
import type { ShopSort } from '~/shared/constants/shop'

// The rental fleet, listed like a shop section but grouped by category instead of
// paged. The sidebar and the mobile sheet are the shop's own filters, minus the
// availability group — there is one machine of each and booking is a phone call.
const api = useApi()

// PrimeVue's Select reads '' as "nothing selected" and falls back to the
// placeholder, so the unfiltered view needs a value of its own.
const ALL_CATEGORIES = 'all'

const category = ref(ALL_CATEGORIES)
const sort = ref<ShopSort>('featured')
const brands = ref<string[]>([])
const facets = ref<string[]>([])
const filtersOpen = ref(false)

const { data: page } = await useAsyncData('page-rentals', () =>
  api<InfoPageResponse>('/pages/rentals'),
)

// The section's own categories, in price-list order — they fill the category filter
// and set the order the groups below appear in.
const { data: tree } = await useAsyncData('rentals-categories', () =>
  api<CategorySectionResponse>(`/categories/${encodeURIComponent(RENTALS_SECTION)}`),
)

// The whole fleet in one request: the page lists every machine, grouped, rather
// than paging like the shop listing does.
const { data: fleet, pending } = await useAsyncData(
  'rentals-fleet',
  () =>
    api<ProductListResponse>('/products', {
      query: {
        category: RENTALS_SECTION,
        sub: category.value === ALL_CATEGORIES ? undefined : category.value,
        brand: brands.value,
        facet: facets.value,
        // 'featured' is the API's natural order, so it isn't sent.
        sort: sort.value === 'featured' ? undefined : sort.value,
        limit: RENTAL_FLEET_LIMIT,
      },
    }),
  { watch: [category, brands, facets, sort] },
)

const machineCount = (count: number) => `${count} ${count === 1 ? 'machine' : 'machines'}`

const total = computed(() => fleet.value?.total ?? 0)
const countLabel = computed(() => machineCount(total.value))
const brandOptions = computed(() => fleet.value?.facets.brands ?? [])
const facetTitle = computed(() => fleet.value?.facets.facetTitle ?? '')

// The facet axis belongs to one category — 'Trailer type', 'Heater type' — so it is
// only offered once a category is picked. Across the whole fleet the values run from
// "Tractors" to "20 x 20" and mean nothing together.
const typeOptions = computed(() =>
  category.value === ALL_CATEGORIES ? [] : (fleet.value?.facets.facetValues ?? []),
)

const categoryOptions = computed(() => [
  { label: 'All rentals', value: ALL_CATEGORIES },
  ...(tree.value?.subs ?? []).map((sub) => ({
    label: `${sub.name} (${sub.productCount})`,
    value: sub.name,
  })),
])

const groups = computed(() => {
  const items = fleet.value?.items ?? []

  return (tree.value?.subs ?? [])
    .map((sub) => ({ name: sub.name, items: items.filter((item) => item.category === sub.name) }))
    .filter((group) => group.items.length > 0)
})

// Mobile toolbar badge: every checked box in the sheet, plus a non-default sort.
const activeFilterCount = computed(
  () => brands.value.length + facets.value.length + (sort.value === 'featured' ? 0 : 1),
)

const clearFilters = () => {
  brands.value = []
  facets.value = []
  sort.value = 'featured'
}

// Every category has its own brands and its own facet axis, so boxes ticked for the
// last one would filter the next down to nothing (design: openShop()).
watch(category, clearFilters)

// The sheet is a mobile-only overlay — dismiss it if the viewport grows into the
// sidebar layout. (VoltDrawer's `block-scroll` locks the page behind it.)
const isDesktop = useMediaQuery('(min-width: 1024px)')

watch(isDesktop, (desktop) => {
  if (desktop) {
    filtersOpen.value = false
  }
})

useHead({ title: 'Rentals' })
useSeoMeta({
  description:
    'Equipment rentals at Thornloe Farm Supply — tractors, tillers, trailers, concrete and compaction gear, heaters and event tents, priced by the half day, weekend, week or month.',
})
</script>
