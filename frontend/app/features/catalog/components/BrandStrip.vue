<template>
  <div class="border-line mt-16 border-t pt-6">
    <p class="text-muted mb-4 text-xs font-semibold tracking-[0.08em] uppercase">Brands we carry</p>
    <!-- Two identical tracks slide together so the loop is seamless; the mask
         fades both edges (design `.brand-track-wrap`). -->
    <div
      class="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]"
    >
      <div
        v-if="!logos.length"
        class="flex items-center gap-12 py-4"
      >
        <VoltSkeleton
          v-for="n in 6"
          :key="n"
          width="140px"
          height="56px"
        />
      </div>

      <div
        v-for="track in logos.length ? 2 : 0"
        v-else
        :key="track"
        class="flex shrink-0 animate-brand-scroll items-center gap-12 pr-12 motion-reduce:animate-none"
        :aria-hidden="track === 2 ? 'true' : undefined"
      >
        <span
          v-for="brand in logos"
          :key="brand.name"
          class="flex h-[108px] flex-none items-center"
        >
          <NuxtImg
            :src="brand.image"
            format="webp"
            :alt="track === 1 ? brand.name : ''"
            :style="{ maxHeight: `${brand.maxHeight}px` }"
            class="block h-auto w-auto max-w-[220px] object-contain"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BrandListResponse } from '#shared/types/catalog'

// Defaults to the catalogue brands (shop, categories); Service and Tires pass
// their own scope. Logos come from GET /brands?scope=.
const props = withDefaults(defineProps<{ scope?: 'catalogue' | 'service' | 'tires' }>(), {
  scope: 'catalogue',
})

const api = useApi()

const { data } = await useAsyncData(
  () => `brands-${props.scope}`,
  () => api<BrandListResponse>('/brands', { query: { scope: props.scope } }),
  // Lazy so the strip's skeleton shows instead of holding the whole page back —
  // logos are decoration, not the reason anyone opened the page.
  { lazy: true },
)

const logos = computed(() => data.value?.logos ?? [])
</script>
