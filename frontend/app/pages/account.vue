<template>
  <div class="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[264px_minmax(0,1fr)]">
    <!-- Rail: desktop only (design hides it below lg in favour of the tab bar) -->
    <aside
      class="border-line hidden flex-col gap-6 overflow-y-auto border-r bg-panel px-4 py-6 lg:flex"
    >
      <div
        class="flex min-w-0 items-center gap-3 bg-[image:var(--grad-accent)] px-4 py-3 text-white"
      >
        <span
          class="text-brand flex h-10 w-10 flex-none items-center justify-center bg-white text-sm font-semibold"
        >
          {{ initials }}
        </span>
        <span class="min-w-0">
          <span class="block text-sm leading-[1.3] font-semibold text-white">
            {{ displayName }}
          </span>
          <span class="block overflow-hidden text-xs text-ellipsis whitespace-nowrap text-white/80">
            {{ displayEmail }}
          </span>
        </span>
      </div>

      <nav
        class="flex flex-col gap-0.5"
        aria-label="Account"
      >
        <button
          v-for="item in TABS"
          :key="item.value"
          type="button"
          :class="[NAV_ITEM, tab === item.value && 'border-line! text-brand bg-surface']"
          @click="tab = item.value"
        >
          <SlIcon
            v-if="item.value === 'profile'"
            name="user-single-neutral-male"
            class="text-[17px]"
          />
          <span
            v-else
            class="sl-icon text-[17px]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="square"
              stroke-linejoin="miter"
            >
              <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
              <polyline points="3 7 12 11 21 7" />
              <line
                x1="12"
                y1="11"
                x2="12"
                y2="21"
              />
            </svg>
          </span>
          {{ item.label }}
          <span
            v-if="item.value === 'orders' && orderData"
            class="text-muted ml-auto text-xs font-medium tabular-nums"
          >
            {{ orderData.total }}
          </span>
        </button>
      </nav>

      <div class="border-line mt-auto flex flex-col gap-3 border-t pt-4">
        <p class="text-muted flex items-start gap-2 px-3 text-xs leading-[1.5]">
          <span
            class="sl-icon mt-0.5 flex-none text-[15px]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="square"
              stroke-linejoin="miter"
            >
              <path d="M4 4h5l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v5h-1A15 15 0 0 1 4 5z" />
            </svg>
          </span>
          <span>
            Questions about an order? Call the counter at
            <a
              :href="site.phoneHref"
              class="text-brand font-semibold"
              >{{ site.phone }}</a
            >.
          </span>
        </p>
        <button
          type="button"
          class="border-line text-muted hover:text-badge grid grid-cols-[16px_minmax(0,1fr)] items-center gap-2 border-t px-3 pt-4 pb-2 text-left text-sm font-semibold transition-colors duration-[350ms]"
          @click="signOut"
        >
          <span
            class="sl-icon text-[16px]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="square"
              stroke-linejoin="miter"
            >
              <path d="M15 4h5v16h-5" />
              <line
                x1="12"
                y1="12"
                x2="3"
                y2="12"
              />
              <polyline points="7 8 3 12 7 16" />
            </svg>
          </span>
          Sign out
        </button>
      </div>
    </aside>

    <div class="flex min-w-0 flex-col overflow-hidden">
      <!-- Tab bar: mobile only -->
      <div
        class="border-line grid flex-none grid-cols-2 border-b bg-surface lg:hidden"
        role="tablist"
      >
        <button
          v-for="item in TABS"
          :key="item.value"
          type="button"
          role="tab"
          :aria-selected="tab === item.value"
          :class="[
            'flex h-[52px] items-center justify-center gap-2 border-b-2 text-sm font-semibold transition-[color,border-color] duration-[350ms]',
            tab === item.value ? 'border-brand text-brand' : 'text-muted border-transparent',
          ]"
          @click="tab = item.value"
        >
          {{ item.label }}
        </button>
      </div>

      <ClientOnly>
        <template #fallback>
          <div class="flex flex-col gap-3 p-6">
            <VoltSkeleton
              v-for="n in 4"
              :key="n"
              height="64px"
            />
          </div>
        </template>

        <template v-if="tab === 'orders'">
          <div
            v-if="ordersPending && !orders.length"
            class="flex flex-col gap-3 p-6"
          >
            <VoltSkeleton
              v-for="n in 4"
              :key="n"
              height="64px"
            />
          </div>
          <OrderList
            v-else
            v-model:status="status"
            :orders="orders"
            :open-number="linkedNumber"
            :missing-number="missingNumber"
            @select="syncOpenOrder"
          />
        </template>

        <template v-else>
          <div
            v-if="profilePending && !profileData"
            class="flex flex-col gap-3 p-6"
          >
            <VoltSkeleton
              v-for="n in 6"
              :key="n"
              height="52px"
            />
          </div>
          <ProfileForm
            v-else-if="profileData"
            :profile="profileData.profile"
            @saved="refreshProfile"
          />
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiOrder, OrderListResponse, ProfileResponse } from '#shared/types/account'

// Design `#view-account`. Orders and the profile come from the API; both calls are
// client-only because the bearer token lives in localStorage.
definePageMeta({ layout: 'app', middleware: 'auth' })

const api = useApi()
const route = useRoute()
const router = useRouter()
const { site } = useSite()
const { user } = useSession()
const { signOut } = useAuthActions()

const TABS = [
  { value: 'orders', label: 'Orders' },
  { value: 'profile', label: 'Account' },
] as const

const NAV_ITEM =
  'text-ink hover:bg-surface flex w-full items-center gap-3 border border-transparent px-3 py-[0.7rem] text-left text-sm font-semibold transition-[background-color,color,border-color] duration-[350ms]'

const tab = ref<(typeof TABS)[number]['value']>('orders')
const status = ref<'all' | 'open' | 'closed'>('all')

const { data: orderData, pending: ordersPending } = await useAsyncData(
  'account-orders',
  () =>
    api<OrderListResponse>('/orders', {
      query: { status: status.value },
    }),
  { server: false, lazy: true, watch: [status] },
)

const {
  data: profileData,
  pending: profilePending,
  refresh: refreshProfile,
} = await useAsyncData('account-profile', () => api<ProfileResponse>('/user/info'), {
  server: false,
  lazy: true,
})

// Deep link: /account?order=TFS-1042 opens that order. It's fetched through
// GET /orders/{number} rather than waited for in the list, so the row can expand
// as soon as it lands — and so the link works even when the filter hides it.
const linkedNumber = computed(() => (route.query.order as string) || null)

const { data: linkedOrder, error: linkedError } = await useAsyncData(
  () => `account-order-${linkedNumber.value ?? 'none'}`,
  () => {
    const number = linkedNumber.value

    if (!number) {
      return Promise.resolve(null)
    }

    // Already on screen — no reason to ask for it again.
    const loaded = orderData.value?.items.find((order) => order.number === number)

    return loaded ? Promise.resolve(loaded) : api<ApiOrder>(`/orders/${encodeURIComponent(number)}`)
  },
  { server: false, lazy: true },
)

const orders = computed(() => {
  const items = orderData.value?.items ?? []
  const linked = linkedOrder.value

  if (!linked || items.some((order) => order.number === linked.number)) {
    return items
  }

  // The current filter leaves it out, but the link asked for it by name.
  return [linked, ...items]
})

const missingNumber = computed(() => (linkedError.value ? linkedNumber.value : null))

const syncOpenOrder = (number: string | null) => {
  router.replace({ query: { ...route.query, order: number ?? undefined } })
}

// Picking a filter consumes the link — otherwise the pinned order would sit on
// top of a filter that excludes it.
watch(status, () => {
  if (linkedNumber.value) {
    syncOpenOrder(null)
  }
})

const displayName = computed(() => user.value?.name ?? profileData.value?.profile.name ?? '')
const displayEmail = computed(() => user.value?.email ?? profileData.value?.profile.email ?? '')

const initials = computed(() =>
  displayName.value
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
)

useHead({ title: 'Account' })
useSeoMeta({ robots: 'noindex' })
</script>
