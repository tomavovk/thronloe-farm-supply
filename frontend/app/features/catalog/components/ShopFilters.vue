<template>
  <!-- Desktop: static sidebar (design `.filters-sheet` from lg up). -->
  <aside class="hidden self-start lg:block">
    <ShopFilterFields
      v-model:sort="sort"
      v-model:brands="brands"
      v-model:stock="stock"
      v-model:facets="facets"
      :brand-options="brandOptions"
      :facet-options="facetOptions"
      :facet-title="facetTitle"
    />
  </aside>

  <!-- Mobile: the same fields in a bottom sheet. VoltDrawer brings the mask, the
       focus trap, Escape-to-close and the body scroll lock the design hand-rolled. -->
  <VoltDrawer
    v-model:visible="open"
    position="bottom"
    header="Filters"
    block-scroll
  >
    <ShopFilterFields
      v-model:sort="sort"
      v-model:brands="brands"
      v-model:stock="stock"
      v-model:facets="facets"
      :brand-options="brandOptions"
      :facet-options="facetOptions"
      :facet-title="facetTitle"
    />

    <template #footer>
      <VoltButton
        severity="secondary"
        class="flex-1"
        @click="emit('clear')"
      >
        Clear all
      </VoltButton>
      <VoltButton
        class="flex-1"
        @click="open = false"
      >
        {{
          resultCount ? `Show ${resultCount} product${resultCount === 1 ? '' : 's'}` : 'No matches'
        }}
      </VoltButton>
    </template>
  </VoltDrawer>
</template>

<script setup lang="ts">
import type { ShopSort } from '~/shared/constants/shop'

// The design's one element in two roles becomes two renderings of one field set:
// a static sidebar from lg up, a bottom sheet below it.
defineProps<{
  brandOptions: string[]
  facetOptions: string[]
  facetTitle: string
  resultCount: number
}>()

const emit = defineEmits<{ clear: [] }>()

const open = defineModel<boolean>('open', { required: true })
const sort = defineModel<ShopSort>('sort', { required: true })
const brands = defineModel<string[]>('brands', { required: true })
const stock = defineModel<string[]>('stock', { required: true })
const facets = defineModel<string[]>('facets', { required: true })
</script>
