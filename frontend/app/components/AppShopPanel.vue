<template>
  <div
    class="border-line absolute top-full right-0 left-0 cursor-default border-b bg-panel transition-[opacity,transform,visibility] duration-[350ms]"
    :class="open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1.5 opacity-0'"
  >
    <div class="container-page">
      <div class="border-line flex items-center justify-between gap-4 border-b pt-8 pb-4">
        <span class="text-lg font-semibold tracking-[-0.01em]">Shop</span>
        <VoltButton
          to="/categories"
          size="sm"
        >
          See all categories
        </VoltButton>
      </div>

      <div class="grid grid-cols-12 gap-4 py-8">
        <div
          v-for="section in SHOP_SECTIONS"
          :key="section.name"
          class="col-span-3"
        >
          <h4
            class="border-line text-muted mb-4 border-b pb-3 text-xs font-semibold tracking-[0.12em] uppercase"
          >
            {{ section.name }}
          </h4>
          <ul class="flex list-none flex-col gap-3">
            <li
              v-for="item in section.items"
              :key="item"
            >
              <NuxtLink
                :to="shopItemRoute(section.name, item)"
                aria-current-value="false"
                class="text-ink hover:text-brand text-base font-semibold transition-colors duration-[350ms]"
              >
                {{ item }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SHOP_SECTIONS, shopItemRoute } from '~/shared/constants/navigation'

// Desktop mega panel. Absolutely positioned against the header's `.nav-inner`
// row (which is the relative ancestor), so it spans the full container width.
//
// `aria-current-value="false"`: every item here targets /shop and differs only by
// query, which vue-router ignores when matching — without it, all 21 links claim
// to be the current page as soon as you're anywhere on /shop.
defineProps<{ open: boolean }>()
</script>
