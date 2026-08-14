<template>
  <section class="py-24">
    <div class="container-page">
      <div class="mb-8 flex flex-wrap items-baseline gap-4">
        <h1 class="text-xl font-semibold">Search</h1>
        <span class="text-muted text-sm">{{ countLabel }}</span>
      </div>

      <form
        class="mb-8 flex max-w-[640px] gap-3"
        @submit.prevent="submit"
      >
        <label
          class="border-line text-muted flex h-[52px] flex-1 cursor-text items-center gap-2 border bg-panel px-4"
        >
          <SlIcon
            name="magnifying-glass"
            class="text-[17px]"
          />
          <VoltInputText
            v-model="term"
            bare
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            autocomplete="off"
            class="text-base"
          />
          <button
            v-show="term"
            type="button"
            aria-label="Clear search"
            tabindex="-1"
            class="text-muted hover:text-ink flex h-6 w-6 flex-none items-center justify-center transition-colors duration-200"
            @click="term = ''"
          >
            <UiGlyph
              name="close"
              class="text-[17px]"
            />
          </button>
        </label>
        <VoltButton
          type="submit"
          :loading="pending"
        >
          Search
        </VoltButton>
      </form>

      <ProductGridSkeleton
        v-if="pending && !data"
        :count="8"
        grid-class="grid grid-cols-2 gap-x-4 gap-y-16 md:grid-cols-3 lg:grid-cols-4"
      />
      <div
        v-else-if="items.length"
        class="grid grid-cols-2 gap-x-4 gap-y-16 md:grid-cols-3 lg:grid-cols-4"
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
      <div
        v-else
        class="text-muted py-24 text-center"
      >
        <p>
          {{
            query
              ? 'No products found. Try a different term.'
              : 'Start typing to search our catalogue.'
          }}
        </p>
      </div>

      <VoltPaginator
        v-if="pages > 1"
        :rows="SEARCH_PER_PAGE"
        :total-records="total"
        :first="(page - 1) * SEARCH_PER_PAGE"
        @page="page = $event.page + 1"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SearchResponse } from '#shared/types/catalog'
import { SEARCH_PER_PAGE } from '~/shared/constants/shop'

// `?q=` is the source of truth: the header and mobile-menu search boxes navigate
// here, so the results survive a reload and a shared link.
const api = useApi()
const route = useRoute()
const router = useRouter()

const query = computed(() => ((route.query.q as string) ?? '').trim())
const term = ref(query.value)
const page = ref(1)

const { data, pending } = await useAsyncData(
  () => `search-${query.value}`,
  () =>
    query.value
      ? api<SearchResponse>('/search', {
          query: { q: query.value, page: page.value, limit: SEARCH_PER_PAGE },
        })
      : Promise.resolve(null),
  // Lazy: a search submitted from the header should land on the results page with
  // its skeleton, not stall on whatever page you were reading.
  { lazy: true, watch: [page] },
)

const items = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const pages = computed(() => Math.max(1, Math.ceil(total.value / SEARCH_PER_PAGE)))

const countLabel = computed(() => {
  if (!query.value) {
    return ''
  }

  if (pending.value && !data.value) {
    return 'Searching…'
  }

  if (!total.value) {
    return `No results for “${query.value}”`
  }

  const first = (page.value - 1) * SEARCH_PER_PAGE + 1
  const shown = `${first}–${first + items.value.length - 1}`

  return `${total.value} result${total.value === 1 ? '' : 's'} for “${query.value}” · showing ${shown}`
})

const submit = () => {
  router.push({ path: '/search', query: term.value.trim() ? { q: term.value.trim() } : {} })
}

// A new query (typed here, or from the header on another page) restarts paging and
// keeps the field in sync.
watch(query, (next) => {
  term.value = next
  page.value = 1
})

useHead({ title: () => (query.value ? `Search: ${query.value}` : 'Search') })
useSeoMeta({ robots: 'noindex' })
</script>
