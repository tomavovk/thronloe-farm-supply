<template>
  <VoltGalleria
    v-model:active-index="index"
    :value="images"
    :num-visible="4"
    :show-thumbnail-navigators="false"
    :show-item-navigators="images.length > 1"
    :circular="images.length > 1"
    :aria-label="alt"
  >
    <template #item="{ item }">
      <span
        v-if="badge"
        class="absolute top-4 left-4 z-[2] px-[0.7rem] py-[0.35rem] text-xs font-semibold tracking-[0.06em] text-white uppercase"
        :class="BADGE_BG[badge.kind]"
      >
        {{ badge.label }}
      </span>
      <NuxtImg
        :src="item"
        format="webp"
        :alt="alt"
        width="900"
        height="900"
        class="h-full w-full object-cover"
      />
    </template>

    <template #thumbnail="{ item }">
      <NuxtImg
        :src="item"
        format="webp"
        alt=""
        width="72"
        height="72"
        class="h-[72px] w-[72px] object-cover"
      />
    </template>
  </VoltGalleria>
</template>

<script setup lang="ts">
import type { BadgeKind, ProductBadge } from '~/shared/utils/catalogue'

// Design `.pdp-gallery` — the stage/navigator/thumbnail styling lives in
// shared/volt/Galleria.vue; this component only supplies the photos, the badge
// overlay and the reset-on-product-change behaviour.
const props = defineProps<{
  images: string[]
  alt: string
  badge: ProductBadge | null
}>()

const BADGE_BG: Record<BadgeKind, string> = {
  sale: 'bg-badge',
  new: 'bg-ink',
  out: 'bg-muted',
}

const index = ref(0)

// A different product means a different gallery — start from its first photo.
watch(
  () => props.images,
  () => {
    index.value = 0
  },
)
</script>
