<template>
  <section class="pt-6 pb-24">
    <div class="container-page">
      <div class="border-line mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <div class="flex flex-wrap items-baseline gap-4">
          <h1 class="text-xl font-semibold">
            {{ category }}
          </h1>
          <span class="text-muted text-sm">{{ countLabel }}</span>
        </div>
        <VoltButton
          to="/categories"
          severity="secondary"
        >
          See all categories
          <UiGlyph
            name="arrow-right"
            class="text-[16px]"
          />
        </VoltButton>
      </div>

      <!-- Facet quick-picks: hidden below lg, where the filters sheet takes over.
           Wrapped in a div because a base-level `hidden` on a Volt root is not
           twMerged against its own `inline-flex` (see shared/volt/CLAUDE.md). -->
      <div class="mt-6 mb-8 hidden lg:block">
        <VoltSelectButton
          v-model="facets"
          :options="facetOptions"
          multiple
          :aria-label="facetTitle"
        />
      </div>

      <div
        class="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12"
      >
        <ShopFilters
          v-model:open="filtersOpen"
          v-model:sort="sort"
          v-model:brands="brands"
          v-model:stock="stock"
          v-model:facets="facets"
          :brand-options="brandOptions"
          :facet-options="facetOptions"
          :facet-title="facetTitle"
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

          <ProductGridSkeleton
            v-if="pending && !data"
            :count="6"
          />
          <div
            v-else-if="items.length"
            class="grid min-w-0 grid-cols-2 gap-x-4 gap-y-16 md:grid-cols-3"
            :class="pending && 'opacity-60 transition-opacity'"
          >
            <ProductCard
              v-for="product in items"
              :key="product.id"
              :product="product"
              show-stock
              show-action
            />
          </div>
          <p
            v-else
            class="text-muted text-sm"
          >
            No products match these filters.
          </p>

          <VoltPaginator
            v-if="pages > 1"
            :rows="SHOP_PER_PAGE"
            :total-records="total"
            :first="(page - 1) * SHOP_PER_PAGE"
            @page="page = $event.page + 1"
          />
        </div>
      </div>

      <BrandStrip />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import type { ProductListResponse } from '#shared/types/catalog'
import { DEFAULT_SHOP_CATEGORY, SHOP_PER_PAGE, type ShopSort } from '~/shared/constants/shop'

// Listing for one shop section ("Feed") or one leaf category ("Beef"). The nav
// links carry `?category=<section>&sub=<leaf>`; `sub` wins when present, since a
// leaf is the narrower view. Filtering, sorting and paging all happen in the API.
const api = useApi()
const route = useRoute()

const category = computed(() => {
  const { category: section, sub } = route.query

  return (sub as string) || (section as string) || DEFAULT_SHOP_CATEGORY
})

const sort = ref<ShopSort>('featured')
const brands = ref<string[]>([])
const stock = ref<string[]>([])
const facets = ref<string[]>([])
const page = ref(1)
const filtersOpen = ref(false)

const { data, pending } = await useAsyncData(
  () => `shop-${category.value}`,
  () =>
    api<ProductListResponse>('/products', {
      query: {
        category: route.query.category ?? undefined,
        sub: route.query.sub ?? undefined,
        brand: brands.value,
        stock: stock.value,
        facet: facets.value,
        // 'featured' is the API's natural order, so it isn't sent.
        sort: sort.value === 'featured' ? undefined : sort.value,
        page: page.value,
        limit: SHOP_PER_PAGE,
      },
    }),
  // Lazy so entering the listing paints the skeleton grid rather than sitting on
  // the previous page; re-filtering keeps the loaded page and dims it instead.
  { lazy: true, watch: [brands, stock, facets, sort, page] },
)

const items = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const pages = computed(() => Math.max(1, Math.ceil(total.value / SHOP_PER_PAGE)))
const brandOptions = computed(() => data.value?.facets.brands ?? [])
const facetOptions = computed(() => data.value?.facets.facetValues ?? [])
const facetTitle = computed(() => data.value?.facets.facetTitle ?? '')

const countLabel = computed(() => {
  if (pending.value && !data.value) {
    return 'Loading…'
  }

  if (!total.value) {
    return 'No products match these filters.'
  }

  const first = (page.value - 1) * SHOP_PER_PAGE + 1

  return `${total.value} products · showing ${first}–${first + items.value.length - 1}`
})

// Mobile toolbar badge: every checked box, plus a non-default sort.
const activeFilterCount = computed(
  () =>
    brands.value.length +
    stock.value.length +
    facets.value.length +
    (sort.value === 'featured' ? 0 : 1),
)

const clearFilters = () => {
  brands.value = []
  stock.value = []
  facets.value = []
  sort.value = 'featured'
}

// Any filter change goes back to page one; switching category clears everything
// (design: openShop() unchecks every box).
watch([brands, stock, facets, sort], () => {
  page.value = 1
})

watch(category, () => {
  clearFilters()
  page.value = 1
})

// Keep the page in range when filtering shrinks the result set.
watch(pages, (count) => {
  if (page.value > count) {
    page.value = count
  }
})

watch(page, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
})

// The sheet is a mobile-only overlay — dismiss it if the viewport grows into the
// sidebar layout. (VoltDrawer's `block-scroll` locks the page behind it.)
const isDesktop = useMediaQuery('(min-width: 1024px)')

watch(isDesktop, (desktop) => {
  if (desktop) {
    filtersOpen.value = false
  }
})

useHead({ title: () => category.value })
useSeoMeta({
  description: () =>
    `${category.value} at Thornloe Farm Supply — ${total.value} products in stock and on order.`,
})
</script>
