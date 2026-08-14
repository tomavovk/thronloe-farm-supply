<template>
  <div class="flex flex-col gap-6 lg:gap-8">
    <div>
      <h4 :class="GROUP_TITLE">Sort by</h4>
      <VoltSelect
        v-model="sort"
        :options="[...SORT_OPTIONS]"
        option-label="label"
        option-value="value"
        aria-label="Sort products"
      />
    </div>

    <div>
      <h4 :class="GROUP_TITLE">Brand</h4>
      <div :class="LIST">
        <label
          v-for="brand in brandOptions"
          :key="brand"
          :class="ROW"
        >
          <VoltCheckbox
            v-model="brands"
            :value="brand"
          />
          {{ brand }}
        </label>
      </div>
    </div>

    <div>
      <h4 :class="GROUP_TITLE">Availability</h4>
      <div :class="LIST">
        <label :class="ROW">
          <VoltCheckbox
            v-model="stock"
            value="in-stock"
          />
          In stock
        </label>
      </div>
    </div>

    <div>
      <h4 :class="GROUP_TITLE">
        {{ facetTitle }}
      </h4>
      <div :class="LIST">
        <label
          v-for="option in facetOptions"
          :key="option"
          :class="ROW"
        >
          <VoltCheckbox
            v-model="facets"
            :value="option"
          />
          {{ option }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SORT_OPTIONS, type ShopSort } from '~/shared/constants/shop'

// The four filter groups, shared by the desktop sidebar and the mobile drawer so
// the controls exist once. Checkboxes stay wrapped in a <label>: PrimeVue binds
// onChange to the hidden input, so the label is what makes the box clickable.
defineProps<{
  brandOptions: string[]
  facetOptions: string[]
  facetTitle: string
}>()

const sort = defineModel<ShopSort>('sort', { required: true })
const brands = defineModel<string[]>('brands', { required: true })
const stock = defineModel<string[]>('stock', { required: true })
const facets = defineModel<string[]>('facets', { required: true })

const GROUP_TITLE = 'text-ink mb-3 text-xs font-semibold tracking-[0.08em] uppercase'
const LIST = 'flex flex-col gap-2'
const ROW =
  'text-muted hover:text-ink flex cursor-pointer items-center gap-2 text-sm transition-colors duration-[350ms]'
</script>
