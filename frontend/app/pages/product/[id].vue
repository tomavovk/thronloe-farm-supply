<template>
  <div>
    <section class="pt-6 pb-24">
      <div class="container-page">
        <nav
          class="text-muted mb-6 flex flex-wrap items-center gap-2 text-sm"
          aria-label="Breadcrumb"
        >
          <NuxtLink
            :to="shopSectionRoute(section)"
            aria-current-value="false"
            :class="CRUMB"
          >
            {{ section }}
          </NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink
            :to="shopSectionRoute(product.category)"
            aria-current-value="false"
            :class="CRUMB"
          >
            {{ product.category }}
          </NuxtLink>
          <span aria-hidden="true">/</span>
          <span
            class="text-ink"
            aria-current="page"
          >
            {{ product.name }}
          </span>
        </nav>

        <div
          class="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12 lg:items-start lg:gap-x-4 lg:gap-y-0"
        >
          <!-- Layout classes go on a wrapper: PrimeVue renders GalleriaContent as
               the gallery's root, so a fallthrough class never reaches it. -->
          <div class="lg:col-span-6">
            <ProductGallery
              :images="images"
              :alt="product.name"
              :badge="badge"
            />
          </div>

          <div class="lg:col-span-6 lg:pl-8">
            <div class="max-w-[34rem]">
              <p
                class="text-muted mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase"
              >
                {{ product.category }}
                <em class="text-line not-italic">—</em>
                {{ product.brand }}
              </p>
              <h1 class="mb-4 text-2xl font-semibold">
                {{ product.name }}
              </h1>
              <p class="text-muted mb-8 max-w-[46ch] text-base">
                {{ description }}
              </p>

              <h4 class="text-ink mb-3 text-xs font-semibold tracking-[0.08em] uppercase">
                {{ options.title }}
              </h4>
              <VoltSelectButton
                v-model="selectedOption"
                :options="options.values"
                option-label="label"
                :allow-empty="false"
                :aria-label="options.title"
                class="mb-8"
              />

              <div class="mb-2 flex items-baseline gap-3">
                <span class="text-[32px] font-semibold tracking-[-0.02em]">
                  {{ formatPrice(price) }}
                </span>
                <span
                  v-if="badge?.kind === 'sale'"
                  class="text-muted text-base line-through"
                >
                  {{ formatPrice(price * SALE_MARKUP) }}
                </span>
              </div>

              <p
                class="mb-6 flex items-center gap-2 text-sm"
                :class="lowStock ? 'text-badge font-semibold' : 'text-muted'"
              >
                <span
                  class="sl-icon"
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
                    <path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z" />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                    />
                  </svg>
                </span>
                {{ stockLabel }}
              </p>

              <div class="flex w-full flex-col items-stretch gap-3">
                <VoltButton
                  to="/contact"
                  class="w-full justify-center"
                >
                  Contact us
                  <UiGlyph
                    name="arrow-long"
                    class="text-[16px]"
                  />
                </VoltButton>
                <VoltButton
                  :href="site.phoneHref"
                  severity="secondary"
                  class="justify-center"
                >
                  Call {{ site.phone }}
                </VoltButton>
              </div>

              <p class="text-muted mt-4 flex flex-col gap-2 text-sm">
                <span class="flex items-center gap-2">
                  <span
                    class="sl-icon"
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
                      <rect
                        x="1"
                        y="7"
                        width="14"
                        height="10"
                      />
                      <polyline points="15 10 19 10 22 13 22 17 15 17" />
                      <circle
                        cx="6"
                        cy="19"
                        r="2"
                      />
                      <circle
                        cx="18"
                        cy="19"
                        r="2"
                      />
                    </svg>
                  </span>
                  Friday delivery — Matheson 1st &amp; 3rd, local 2nd &amp; 4th
                </span>
                <span class="flex items-center gap-2">
                  <span
                    class="sl-icon"
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
                      <path d="M3 9h18v12H3z" />
                      <path d="M3 9l2-5h14l2 5" />
                      <path d="M9 21v-6h6v6" />
                    </svg>
                  </span>
                  In-store pickup any day we’re open
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="mt-24">
          <div class="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h2 class="text-xl font-semibold">You might like</h2>
            <VoltButton
              :to="shopSectionRoute(section)"
              severity="secondary"
            >
              Back to shop
              <UiGlyph
                name="arrow-right"
                class="text-[16px]"
              />
            </VoltButton>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
            <ProductCard
              v-for="item in related"
              :key="item.id"
              :product="item"
              show-stock
              show-action
            />
          </div>
        </div>
      </div>
    </section>

    <UiCtaBanner
      title="Not sure this is the right fit?"
      subtitle="Talk to the counter before you order."
      label="Contact Us"
      to="/contact"
      glyph="arrow-long"
    />
  </div>
</template>

<script setup lang="ts">
import { breadcrumbSchema, productSchema } from '~/shared/utils/schema'
import type { ProductDetailResponse } from '#shared/types/catalog'
import { shopSectionRoute } from '~/shared/constants/navigation'

const api = useApi()
const { site } = useSite()
const route = useRoute()

// One request per product: detail, gallery, options and the related row.
const { data } = await useAsyncData(
  () => `product-${route.params.id}`,
  () => api<ProductDetailResponse>(`/products/${route.params.id}`),
)

// Unknown id → 404 rather than an empty shell.
if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
}

// Past the guard above the product always exists, but neither the template nor the
// computeds below can see that through `data`'s nullable type — so narrow it once,
// here, instead of asserting at every use.
const product = computed(() => data.value!)

const CRUMB = 'text-muted hover:text-brand transition-colors duration-[350ms]'

const section = computed(() => product.value.section)
const images = computed(() => product.value.gallery)
const badge = computed(() => product.value.badge)
const options = computed(() => product.value.options)
const related = computed(() => product.value.related)
const description = computed(() => product.value.description)

// Start on the option matching the product's own facet, so the price shown equals
// the listing price (design: openPDP).
const optionFor = (detail: ProductDetailResponse) =>
  detail.options.values.find((option) => option.label === detail.facet) ?? detail.options.values[0]

const selectedOption = ref(optionFor(product.value))

const price = computed(() => product.value.price * (selectedOption.value?.multiplier ?? 1))

const qty = computed(() => product.value.qty)
const outOfStock = computed(() => badge.value?.kind === 'out')
const lowStock = computed(() => !outOfStock.value && qty.value <= 5)

const stockLabel = computed(() => {
  if (outOfStock.value) {
    return 'Not in stock right now — call and we’ll order it in'
  }

  return lowStock.value ? `Only ${qty.value} left in Thornloe` : `${qty.value} in stock in Thornloe`
})

// Navigating between products (via "You might like") reuses this component.
watch(product, (next) => {
  selectedOption.value = optionFor(next)
})

// Structured data mirroring the page: the product itself, and the crumb trail
// rendered above the gallery. Prices are per selected option, matching what a
// visitor sees.
const now = new Date()

useJsonld(() =>
  productSchema(
    {
      name: product.value.name,
      description: description.value,
      sku: product.value.id,
      url: `/product/${product.value.id}`,
      images: images.value,
      price: price.value,
      inStock: product.value.stock === 'in-stock',
      brandName: product.value.brand,
    },
    now,
  ),
)

useJsonld(() =>
  breadcrumbSchema([
    { name: 'Shop', url: '/shop' },
    { name: section.value, url: `/shop?category=${encodeURIComponent(section.value)}` },
    {
      name: product.value.category,
      url: `/shop?category=${encodeURIComponent(section.value)}&sub=${encodeURIComponent(product.value.category)}`,
    },
    { name: product.value.name, url: `/product/${product.value.id}` },
  ]),
)

useHead({ title: () => product.value.name })
useSeoMeta({ description: () => description.value })
</script>
