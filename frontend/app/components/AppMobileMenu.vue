<template>
  <div
    v-show="open"
    class="border-line fixed right-0 left-0 z-[95] overflow-y-auto overscroll-contain border-y bg-surface shadow-[0_14px_26px_-14px_rgba(24,20,18,.35)] lg:hidden!"
    :style="{ top: `${top}px`, maxHeight: `calc(100dvh - ${top}px)` }"
  >
    <nav aria-label="Mobile">
      <!-- Shop (tier 1) -->
      <button
        :class="[ROW, ROW_TOP, 'group']"
        :aria-expanded="shopOpen"
        @click="shopOpen = !shopOpen"
      >
        <span :class="{ 'text-brand': shopOpen }">Shop</span>
        <UiGlyph
          name="chevron"
          class="text-muted transition-[transform,color] duration-[350ms]"
          :class="shopOpen && 'text-brand rotate-180'"
        />
      </button>

      <div
        v-show="shopOpen"
        class="flex flex-col"
      >
        <NuxtLink
          to="/categories"
          :class="[ROW, ROW_SUB, 'group']"
        >
          <span class="font-bold">See all categories</span>
          <UiGlyph
            name="arrow-right"
            :class="ARROW"
          />
        </NuxtLink>

        <!-- Sections (tier 2) -->
        <template
          v-for="section in SHOP_SECTIONS"
          :key="section.name"
        >
          <button
            :class="[ROW, ROW_SUB, 'group']"
            :aria-expanded="isOpen(section.name)"
            @click="toggle(section.name)"
          >
            <span :class="{ 'text-brand': isOpen(section.name) }">{{ section.name }}</span>
            <UiGlyph
              name="chevron"
              class="text-muted transition-[transform,color] duration-[350ms]"
              :class="isOpen(section.name) && 'text-brand rotate-180'"
            />
          </button>

          <!-- Leaves (tier 3) -->
          <div
            v-show="isOpen(section.name)"
            class="flex flex-col bg-panel"
          >
            <NuxtLink
              v-for="item in section.items"
              :key="item"
              :to="shopItemRoute(section.name, item)"
              aria-current-value="false"
              :class="[LEAF, 'group']"
            >
              <span>{{ item }}</span>
              <UiGlyph
                name="arrow-right"
                class="text-muted/50 group-hover:text-brand text-[15px] transition-colors duration-[350ms]"
              />
            </NuxtLink>
            <NuxtLink
              :to="shopSectionRoute(section.name)"
              aria-current-value="false"
              :class="[LEAF, 'text-brand font-semibold']"
            >
              <span>See all {{ section.name.toLowerCase() }}</span>
              <UiGlyph
                name="arrow-right"
                class="text-brand text-[15px]"
              />
            </NuxtLink>
          </div>
        </template>
      </div>

      <!-- Direct links (tier 1) -->
      <NuxtLink
        v-for="link in MAIN_NAV"
        :key="link.to"
        :to="link.to"
        :class="[ROW, ROW_TOP, 'group']"
      >
        <span>{{ link.label }}</span>
        <UiGlyph
          name="arrow-right"
          :class="ARROW"
        />
      </NuxtLink>

      <!-- Bottom actions: search + account -->
      <div class="flex flex-col gap-3 p-4">
        <form
          class="border-line flex h-12 items-center gap-2 border bg-panel pr-1 pl-3"
          role="search"
          @submit.prevent="onSearch"
        >
          <SlIcon
            name="magnifying-glass"
            class="text-muted text-[17px]"
          />
          <VoltInputText
            v-model="query"
            bare
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            autocomplete="off"
            class="flex-1 text-base"
          />
          <button
            type="submit"
            aria-label="Search"
            class="flex h-10 w-10 shrink-0 items-center justify-center bg-[image:var(--grad-accent)] text-white"
          >
            <SlIcon
              name="magnifying-glass"
              class="text-[17px] text-white"
            />
          </button>
        </form>
        <VoltButton
          to="/account"
          size="lg"
          class="w-full justify-center"
        >
          <SlIcon name="user-single-neutral-male" />
          My Account
        </VoltButton>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {
  MAIN_NAV,
  SHOP_SECTIONS,
  shopItemRoute,
  shopSectionRoute,
} from '~/shared/constants/navigation'

// `aria-current-value="false"` on the shop links: they differ only by query, which
// vue-router ignores when matching, so its automatic aria-current would mark all
// of them as the current page (see AppShopPanel).
//
// Full-screen overlay menu below the sticky header (`top` is the header's bottom
// edge, measured by the parent). Three tiers: Shop → sections → items, each
// independently collapsible, exactly as the design's accordion behaves.
const props = defineProps<{ open: boolean; top: number }>()
const emit = defineEmits<{ search: [query: string] }>()

// Row styles are shared by the tier-1 toggles, the tier-2 rows and the direct
// links (design `.m-row`, `.m-row-sub`, `.m-leaf`). ROW deliberately carries no
// font size: stacking `text-lg` and `text-base` on one element would let
// Tailwind's own utility order pick the winner, not the class order.
const ROW =
  'flex w-full items-center justify-between gap-3 border-b border-line bg-surface p-4 text-left font-semibold text-ink transition-[color,background-color] duration-[350ms] hover:text-brand'
const ROW_TOP = 'text-lg'
const ROW_SUB = 'pl-6 text-base'
const ARROW = 'text-muted group-hover:text-brand text-[16px] transition-colors duration-[350ms]'
const LEAF =
  'flex items-center justify-between gap-3 border-b border-line py-3 pr-4 pl-8 text-base text-muted transition-[color,background-color] duration-[350ms] last:border-b-0 hover:bg-brand-soft hover:text-brand'

const shopOpen = ref(false)
const openSections = ref<Record<string, boolean>>({})
const query = ref('')

const isOpen = (section: string) => !!openSections.value[section]

const toggle = (section: string) => {
  openSections.value[section] = !openSections.value[section]
}

const onSearch = () => {
  emit('search', query.value)
  query.value = ''
}

// Collapse everything when the overlay closes, so it reopens in its initial state.
watch(
  () => props.open,
  (open) => {
    if (!open) {
      shopOpen.value = false
      openSections.value = {}
    }
  },
)
</script>
