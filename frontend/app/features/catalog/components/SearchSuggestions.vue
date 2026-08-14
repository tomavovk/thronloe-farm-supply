<template>
  <div
    v-show="open"
    :id="id"
    role="listbox"
    aria-label="Search suggestions"
    class="border-line absolute top-[calc(100%+8px)] right-0 left-auto z-[1200] max-h-[70vh] w-[360px] max-w-[calc(100vw-32px)] overflow-auto border bg-surface shadow-dropdown"
  >
    <div
      v-if="pending && !data"
      class="flex flex-col gap-2 p-3"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="flex items-center gap-3"
      >
        <VoltSkeleton
          width="44px"
          height="44px"
        />
        <div class="flex flex-1 flex-col gap-1">
          <VoltSkeleton
            width="70%"
            height="0.75rem"
          />
          <VoltSkeleton
            width="40%"
            height="0.625rem"
          />
        </div>
      </div>
    </div>

    <p
      v-else-if="!matches.length"
      class="text-muted p-4 text-sm"
    >
      No products match “{{ query.trim() }}”
    </p>

    <template v-else>
      <NuxtLink
        v-for="product in matches"
        :key="product.id"
        :to="`/product/${product.id}`"
        role="option"
        class="border-line text-ink flex w-full items-center gap-3 border-b px-3 py-2 text-left transition-colors duration-200 last-of-type:border-b-0 hover:bg-panel"
        @click="emit('pick')"
      >
        <NuxtImg
          :src="product.image"
          format="webp"
          alt=""
          width="44"
          height="44"
          loading="lazy"
          class="h-11 w-11 flex-none bg-panel object-cover"
        />
        <span class="flex min-w-0 flex-col gap-0.5">
          <span class="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
            {{ product.name }}
          </span>
          <span class="text-muted overflow-hidden text-xs text-ellipsis whitespace-nowrap">
            {{ product.category }}{{ product.brand ? ` · ${product.brand}` : '' }}
          </span>
        </span>
        <span class="ml-auto pl-3 text-sm font-semibold whitespace-nowrap">
          {{ formatPrice(product.price) }}
        </span>
      </NuxtLink>

      <p class="text-muted bg-panel p-3 text-xs">
        Press Enter to see all {{ total }} result{{ total === 1 ? '' : 's' }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { SearchResponse } from '#shared/types/catalog'

// Design `.search-popup`: up to six matches under the header's search field, with
// a footer that hints at the full result count. Typing is debounced so a fast
// typist doesn't fire a request per keystroke, and each request aborts the one
// before it (useAsyncData does that for us via the shared key).
const props = defineProps<{ id: string; query: string; open: boolean }>()
const emit = defineEmits<{ pick: [] }>()

const api = useApi()

const term = computed(() => props.query.trim())
const debounced = refDebounced(term, 200)

const { data, pending } = await useAsyncData(
  'search-suggestions',
  () =>
    debounced.value
      ? api<SearchResponse>('/search', { query: { q: debounced.value, limit: 6 } })
      : Promise.resolve(null),
  { server: false, watch: [debounced], immediate: false },
)

const matches = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
</script>
