<template>
  <header
    ref="headerEl"
    class="sticky top-0 z-[100] bg-surface"
  >
    <div class="container-page relative flex items-center gap-4 lg:gap-6">
      <NuxtLink
        to="/"
        class="group flex shrink-0 items-center gap-2.5 lg:flex-1"
      >
        <NuxtImg
          :src="site.logo"
          format="webp"
          :alt="`${site.name} — ${site.tagline}`"
          width="259"
          height="188"
          class="block h-20 w-auto transition-opacity duration-[350ms] group-hover:opacity-[0.82] lg:h-[72px] [@media(min-width:1400px)]:h-[84px]"
        />
      </NuxtLink>

      <nav
        class="hidden items-center gap-1 lg:flex"
        aria-label="Main"
      >
        <div
          ref="shopEl"
          class="flex"
          @mouseenter="openShop"
          @mouseleave="scheduleCloseShop"
        >
          <button
            :class="[NAV_LINK, shopOpen && 'bg-panel']"
            aria-haspopup="true"
            :aria-expanded="shopOpen"
            @click.stop="shopOpen = !shopOpen"
          >
            Shop
            <UiGlyph
              name="chevron"
              class="transition-transform duration-[350ms]"
              :class="shopOpen && 'rotate-180'"
            />
          </button>
          <AppShopPanel :open="shopOpen" />
        </div>

        <NuxtLink
          v-for="link in MAIN_NAV"
          :key="link.to"
          :to="link.to"
          :class="NAV_LINK"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2 lg:flex-1 lg:justify-end">
        <label
          ref="searchEl"
          class="border-line text-muted relative hidden h-[42px] w-[190px] cursor-text items-center gap-2 border bg-panel px-3 xl:flex"
        >
          <SlIcon
            name="magnifying-glass"
            class="text-[17px]"
          />
          <VoltInputText
            v-model="query"
            bare
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            autocomplete="off"
            role="combobox"
            :aria-expanded="suggestionsOpen"
            aria-controls="header-search-suggestions"
            class="text-sm"
            @keydown.enter="submitSearch(query)"
            @keydown.escape="query = ''"
          />
          <button
            v-show="query"
            type="button"
            aria-label="Clear search"
            tabindex="-1"
            class="text-muted hover:text-ink flex h-6 w-6 flex-none items-center justify-center transition-colors duration-200"
            @click="query = ''"
          >
            <UiGlyph name="close" />
          </button>

          <SearchSuggestions
            id="header-search-suggestions"
            :query="query"
            :open="suggestionsOpen"
            @pick="query = ''"
          />
        </label>

        <NuxtLink
          to="/account"
          aria-label="Account"
          :class="UTIL_BTN"
        >
          <SlIcon
            name="user-single-neutral-male"
            class="text-[21px]"
          />
        </NuxtLink>

        <button
          :class="[UTIL_BTN, 'lg:hidden']"
          aria-label="Menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <UiGlyph
            :name="menuOpen ? 'close' : 'bars'"
            class="text-[21px]"
          />
        </button>
      </div>
    </div>

    <AppMobileMenu
      :open="menuOpen"
      :top="overlayTop"
      @search="submitSearch"
    />

    <!-- Dimmed page behind the overlay -->
    <div
      v-show="menuOpen"
      aria-hidden="true"
      class="fixed right-0 bottom-0 left-0 z-[90] bg-[rgba(24,20,18,.5)] transition-opacity duration-300 lg:hidden!"
      :style="{ top: `${overlayTop}px` }"
      @click="menuOpen = false"
    />
  </header>
</template>

<script setup lang="ts">
import {
  onClickOutside,
  onKeyStroke,
  useElementBounding,
  useMediaQuery,
  useScrollLock,
} from '@vueuse/core'
import { MAIN_NAV } from '~/shared/constants/navigation'

const { site } = useSite()
const router = useRouter()
const route = useRoute()
const headerEl = ref<HTMLElement | null>(null)
const shopEl = ref<HTMLElement | null>(null)
const searchEl = ref<HTMLElement | null>(null)
// The overlay menu and its backdrop are anchored to the header's bottom edge —
// the design measures it in JS on open and on resize; this stays reactive.
const { bottom: headerBottom } = useElementBounding(headerEl)
const bodyLocked = useScrollLock(import.meta.client ? document.body : null)

const shopOpen = ref(false)
const menuOpen = ref(false)
const query = ref('')

// `.nav-link` and `.util-btn`, each used by both a <button> and a <NuxtLink>.
const NAV_LINK =
  'flex items-center gap-1.5 px-3 py-2 text-base font-medium text-ink transition-[background-color,color] duration-[350ms] hover:bg-panel hover:text-brand-hover'
const UTIL_BTN =
  'relative flex h-[42px] w-[42px] items-center justify-center text-ink transition-[background-color,color] duration-[350ms] hover:bg-panel hover:text-brand'

const overlayTop = computed(() => Math.max(0, Math.round(headerBottom.value)))

let closeTimer: ReturnType<typeof setTimeout> | undefined

const openShop = () => {
  clearTimeout(closeTimer)
  shopOpen.value = true
}

// Design: leaving the trigger closes the panel after a 150ms grace period, so a
// diagonal mouse path from the button into the panel doesn't dismiss it.
const scheduleCloseShop = () => {
  closeTimer = setTimeout(() => {
    shopOpen.value = false
  }, 150)
}

const submitSearch = (q: string) => {
  const trimmed = q.trim()

  if (!trimmed) {
    return
  }

  menuOpen.value = false
  query.value = ''
  router.push({ path: '/search', query: { q: trimmed } })
}

// Suggestions follow the field's content; clicking away dismisses them without
// clearing what was typed (design: hideSearchPopup()).
const suggestionsDismissed = ref(false)

const suggestionsOpen = computed(() => !!query.value.trim() && !suggestionsDismissed.value)

watch(query, () => {
  suggestionsDismissed.value = false
})

onClickOutside(searchEl, () => {
  suggestionsDismissed.value = true
})

onClickOutside(shopEl, () => {
  shopOpen.value = false
})

onKeyStroke('Escape', () => {
  shopOpen.value = false
  menuOpen.value = false
})

// Body scroll is locked while the overlay is open (design `body.menu-open`).
watch(menuOpen, (open) => {
  bodyLocked.value = open
})

// Navigating closes both menus (design: every nav action calls navigate(), which
// closes the mobile overlay and the mega panel).
watch(
  () => route.fullPath,
  () => {
    shopOpen.value = false
    menuOpen.value = false
  },
)

// Above lg the overlay has no reason to stay open (design's resize handler).
const isDesktop = useMediaQuery('(min-width: 1024px)')

watch(isDesktop, (desktop) => {
  if (desktop) {
    menuOpen.value = false
  }
})

onUnmounted(() => {
  clearTimeout(closeTimer)
})
</script>
