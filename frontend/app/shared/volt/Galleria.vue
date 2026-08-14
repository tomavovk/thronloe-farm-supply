<template>
  <Galleria
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template #previousitemicon>
      <UiGlyph
        name="chevron-left"
        class="text-[16px]"
      />
    </template>
    <template #nextitemicon>
      <UiGlyph
        name="chevron-right"
        class="text-[16px]"
      />
    </template>
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}"
      />
    </template>
  </Galleria>
</template>

<script setup lang="ts">
import Galleria, { type GalleriaPassThroughOptions, type GalleriaProps } from 'primevue/galleria'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ GalleriaProps {}
defineProps<Props>()

// Not part of the ncs Volt set — added here for the product gallery, in the same
// wrapper style as the rest of the folder.
//
// Design `.pdp-gallery`: a square stage on the panel tint, the two navigators
// pinned together at the stage's bottom-right (PrimeVue centres them on the left
// and right edges by default), and a plain 72px thumbnail row with the active
// thumb outlined in ink. The thumbnail strip's own navigators are switched off at
// the call site (`:show-thumbnail-navigators="false"`).
const theme = ref<GalleriaPassThroughOptions>({
  root: `flex flex-col min-w-0`,
  content: `flex flex-col`,
  itemsContainer: `relative flex flex-col`,
  items: `relative aspect-square w-full overflow-hidden bg-panel`,
  item: `h-full w-full`,

  // Section names are `prevButton`/`nextButton` (not `itemPrevButton`), and
  // PrimeVue gives them no accessible name — hence the aria-labels here.
  prevButton: {
    class: `border-line text-ink hover:border-brand hover:text-brand
        absolute bottom-4 right-[calc(1rem+44px+0.5rem)] z-[2]
        inline-flex h-[44px] w-[44px] cursor-pointer items-center justify-center
        border bg-surface
        disabled:pointer-events-none disabled:opacity-45
        transition-[color,border-color] duration-[350ms]`,
    'aria-label': 'Previous photo',
  },
  nextButton: {
    class: `border-line text-ink hover:border-brand hover:text-brand
        absolute bottom-4 right-4 z-[2]
        inline-flex h-[44px] w-[44px] cursor-pointer items-center justify-center
        border bg-surface
        disabled:pointer-events-none disabled:opacity-45
        transition-[color,border-color] duration-[350ms]`,
    'aria-label': 'Next photo',
  },

  thumbnails: `mt-2`,
  thumbnailContent: `flex`,
  thumbnailsViewport: `flex w-full`,
  thumbnailItems: `flex gap-2`,
  // The active thumb is marked with `data-p-active`, not a `data-p` token, so the
  // plugin's `p-active:` variant would never match.
  thumbnailItem: `flex cursor-pointer overflow-hidden border border-transparent bg-panel
        data-[p-active=true]:border-ink
        transition-colors duration-[350ms]`,

  caption: `hidden`,
  indicatorList: `hidden`,
})
</script>
