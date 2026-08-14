<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div class="border-line flex-none border-b p-4 sm:px-6 sm:pt-6 sm:pb-4">
      <h1 class="text-xl font-semibold">Your orders</h1>
      <p class="text-muted mt-1 text-sm">Open an order to see what’s in it and where it’s going.</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="option in FILTERS"
          :key="option.value"
          type="button"
          :class="[
            FILTER_BTN,
            status === option.value && 'border-brand! text-brand! bg-brand-soft',
          ]"
          @click="status = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <div class="max-w-[1080px] p-4 sm:p-6">
        <p
          v-if="missingNumber"
          class="border-badge text-badge mb-4 border bg-surface px-4 py-3 text-sm font-medium"
        >
          Order {{ missingNumber }} isn’t in this account.
        </p>

        <p
          v-if="!orders.length"
          class="text-muted px-6 py-16 text-center text-sm"
        >
          No orders in this view.
        </p>

        <div
          v-else
          class="border-line border"
        >
          <div
            :class="[
              COLS,
              'border-line text-muted hidden items-center gap-4 border-b bg-panel px-6 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase min-[821px]:grid',
            ]"
          >
            <span>Order #</span>
            <span>Date</span>
            <span>Total</span>
            <span>Status</span>
            <span />
          </div>

          <div
            v-for="order in orders"
            :id="`order-${order.number}`"
            :key="order.number"
            class="[&+&]:border-line [&+&]:border-t"
          >
            <button
              type="button"
              :class="[
                COLS,
                'w-full items-center gap-x-3 gap-y-2 p-4 text-left transition-colors duration-[350ms] hover:bg-panel min-[821px]:gap-4 min-[821px]:px-6',
                selected === order.number ? 'bg-panel' : 'bg-surface',
              ]"
              :aria-expanded="selected === order.number"
              @click="toggle(order.number)"
            >
              <span
                class="text-base font-semibold tabular-nums max-[820px]:col-start-1 max-[820px]:row-start-1"
              >
                {{ order.number }}
              </span>
              <span
                class="text-ink text-base tabular-nums max-[820px]:col-start-1 max-[820px]:row-start-2"
              >
                {{ order.placed }}
              </span>
              <span
                class="text-ink text-base font-semibold tabular-nums max-[820px]:col-start-2 max-[820px]:row-start-2 max-[820px]:justify-self-end"
              >
                {{ formatPrice(order.totals.total) }}
              </span>
              <span
                class="max-[820px]:col-start-2 max-[820px]:row-start-1 max-[820px]:justify-self-end"
              >
                <span :class="[PILL, PILL_VARIANT[order.status.kind]]">
                  <span :class="['h-1.5 w-1.5 flex-none', DOT[order.status.kind]]" />
                  {{ order.status.label }}
                </span>
              </span>
              <span class="text-muted flex justify-end max-[820px]:hidden">
                <UiGlyph
                  name="chevron"
                  class="text-[16px] transition-transform duration-[350ms]"
                  :class="selected === order.number && 'rotate-180'"
                />
              </span>
            </button>

            <div
              v-show="selected === order.number"
              class="p-4 sm:px-6 sm:pt-4 sm:pb-6"
            >
              <div
                class="border-line grid grid-cols-1 gap-4 border bg-surface p-4 min-[481px]:grid-cols-2 min-[821px]:grid-cols-4 min-[821px]:gap-x-6 min-[821px]:px-6"
              >
                <div
                  v-for="row in meta(order)"
                  :key="row.label"
                >
                  <p class="text-muted mb-1 text-[11px] font-semibold tracking-[0.12em] uppercase">
                    {{ row.label }}
                  </p>
                  <p class="text-sm leading-[1.45] font-medium whitespace-pre-line">
                    {{ row.value }}
                  </p>
                </div>
              </div>

              <div class="border-line mt-4 border">
                <div
                  :class="[
                    LINE_COLS,
                    'border-line text-muted hidden items-center gap-4 border-b bg-panel px-4 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase min-[821px]:grid',
                  ]"
                >
                  <span />
                  <span>Product</span>
                  <span>Packaging</span>
                  <span>Details</span>
                  <span>Qty</span>
                  <span>Price</span>
                  <span class="text-right">Total</span>
                </div>

                <div
                  v-for="line in order.items"
                  :key="line.name"
                  :class="[
                    LINE_COLS,
                    '[&+&]:border-line grid items-center gap-x-4 gap-y-2 p-4 [&+&]:border-t max-[820px]:grid-cols-[56px_minmax(0,1fr)]',
                  ]"
                >
                  <span class="h-14 w-14 overflow-hidden bg-panel max-[820px]:row-span-5">
                    <NuxtImg
                      :src="line.image"
                      format="webp"
                      alt=""
                      width="56"
                      height="56"
                      loading="lazy"
                      class="h-full w-full object-cover"
                    />
                  </span>
                  <span class="text-sm leading-[1.35] font-semibold">{{ line.name }}</span>
                  <span :class="CELL">
                    <span :class="MOBILE_LABEL">Packaging</span>
                    {{ packaging(line.spec) }}
                  </span>
                  <span :class="CELL">
                    <span :class="MOBILE_LABEL">Details</span>
                    {{ details(line.spec) }}
                  </span>
                  <span :class="[NUM, 'max-[820px]:flex']">
                    <span :class="MOBILE_LABEL">Qty</span>
                    {{ line.qty }}
                  </span>
                  <span :class="[NUM, 'max-[820px]:flex']">
                    <span :class="MOBILE_LABEL">Price</span>
                    {{ formatPrice(line.price) }}
                  </span>
                  <span
                    class="text-sm font-semibold tabular-nums max-[820px]:flex max-[820px]:justify-between min-[821px]:text-right"
                  >
                    <span :class="MOBILE_LABEL">Total</span>
                    {{ formatPrice(line.price * line.qty) }}
                  </span>
                </div>
              </div>

              <div class="border-line mt-4 w-full border bg-panel px-4 py-3">
                <div :class="SUM">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(order.totals.subtotal) }}</span>
                </div>
                <div :class="SUM">
                  <span>Tax (HST {{ Math.round(order.totals.taxRate * 100) }}%)</span>
                  <span>{{ formatPrice(order.totals.tax) }}</span>
                </div>
                <div :class="[SUM, 'text-base font-semibold']">
                  <span>Total</span>
                  <span class="text-lg">{{ formatPrice(order.totals.total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiOrder } from '#shared/types/account'

// Design `#pane-orders`. Filtering is server-side (`/orders?status=`) through the
// `status` model; the rows themselves come in already totalled.
const props = defineProps<{
  orders: ApiOrder[]
  // Order to expand on arrival (from ?order= in the URL), and the number a deep
  // link asked for that this account doesn't have.
  openNumber?: string | null
  missingNumber?: string | null
}>()

const emit = defineEmits<{ select: [string | null] }>()

const status = defineModel<'all' | 'open' | 'closed'>('status', { required: true })

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'In progress' },
  { value: 'closed', label: 'Completed' },
] as const

const COLS =
  'grid grid-cols-[minmax(0,1fr)_auto] min-[821px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.1fr)_32px]'
const LINE_COLS =
  'min-[821px]:grid-cols-[56px_minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_50px_84px_90px]'
const FILTER_BTN =
  'border-line text-muted hover:border-brand hover:text-brand border bg-surface px-[0.85rem] py-[0.35rem] text-xs font-semibold transition-[color,border-color] duration-[350ms]'
const PILL =
  'inline-flex items-center gap-1.5 border px-[9px] py-[3px] text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase'
const PILL_VARIANT = {
  live: 'border-brand text-brand bg-brand-soft',
  done: 'border-line text-muted bg-surface',
  cancelled: 'border-badge text-badge bg-surface',
} as const
const DOT = {
  live: 'bg-brand',
  done: 'bg-[oklch(0.6_0.11_150)]',
  cancelled: 'bg-badge',
} as const
const CELL = 'text-muted text-sm max-[820px]:flex max-[820px]:justify-between max-[820px]:gap-3'
const NUM =
  'text-muted text-sm tabular-nums whitespace-nowrap max-[820px]:justify-between max-[820px]:gap-3'
const MOBILE_LABEL =
  'text-muted text-[11px] font-semibold tracking-[0.1em] uppercase min-[821px]:hidden'
const SUM = 'flex items-baseline justify-between gap-4 py-1 text-sm'

const selected = ref<string | null>(props.openNumber ?? null)

// A deep link arriving later (or changing) wins over whatever was open.
watch(
  () => props.openNumber,
  (number) => {
    if (number) {
      selected.value = number
    }
  },
)

// Bring the linked row into view — with four orders it can sit below the fold of
// the scrolling pane.
watch(
  () => [props.openNumber, props.orders] as const,
  async ([number, orders]) => {
    if (!number || !orders.some((order) => order.number === number)) {
      return
    }

    await nextTick()
    document.getElementById(`order-${number}`)?.scrollIntoView({ block: 'nearest' })
  },
  { immediate: true },
)

const meta = (order: ApiOrder) => {
  const pickup = order.fulfilment === 'Pickup'

  return [
    {
      label: pickup ? 'Pickup' : 'Shipping',
      value: pickup ? 'At the yard counter' : order.preferredRun,
    },
    {
      label: order.status.kind === 'cancelled' ? 'Cancelled' : pickup ? 'Pickup date' : 'Ship date',
      value: order.slot,
    },
    { label: pickup ? 'Location' : 'Address', value: order.place },
  ]
}

// "25 kg bag · Shur-Gain" → packaging + the rest.
const packaging = (spec: string) => spec.split(' · ')[0] || '—'
const details = (spec: string) => spec.split(' · ').slice(1).join(' · ') || '—'

// Only a real click reports back — the fallback selection below shouldn't rewrite
// the URL on every filter change.
const toggle = (number: string) => {
  selected.value = selected.value === number ? null : number
  emit('select', selected.value)
}

// Keep the open row inside the current filter (design: falls back to the first).
watch(
  () => props.orders,
  (orders) => {
    if (!orders.some((order) => order.number === selected.value)) {
      selected.value = orders[0]?.number ?? null
    }
  },
)
</script>
