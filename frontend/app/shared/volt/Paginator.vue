<template>
  <Paginator
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template
      #container="{
        page,
        pageCount,
        pageLinks,
        changePageCallback,
        prevPageCallback,
        nextPageCallback,
      }"
    >
      <div class="flex flex-wrap items-center gap-2">
        <button
          :class="PAGE_BTN"
          :disabled="page === 0"
          aria-label="Previous page"
          @click="prevPageCallback"
        >
          <UiGlyph
            name="chevron-left"
            class="text-[14px]"
          />
        </button>

        <button
          v-for="pageLink of pageLinks"
          :key="pageLink"
          :class="[PAGE_BTN, page + 1 === pageLink && 'bg-panel border-ink! text-ink!']"
          :aria-current="page + 1 === pageLink ? 'page' : 'false'"
          @click="changePageCallback(pageLink - 1)"
        >
          {{ pageLink }}
        </button>

        <button
          :class="PAGE_BTN"
          :disabled="page === (pageCount ?? 1) - 1"
          aria-label="Next page"
          @click="nextPageCallback"
        >
          <UiGlyph
            name="chevron-right"
            class="text-[14px]"
          />
        </button>
      </div>
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
  </Paginator>
</template>

<script setup lang="ts">
import Paginator, {
  type PaginatorPassThroughOptions,
  type PaginatorProps,
} from 'primevue/paginator'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ PaginatorProps {}
defineProps<Props>()

// Design `.pagination` / `.page-btn`: prev, every page number, next — no first/last
// jumps and no rows-per-page control, so the container slot is rewritten rather
// than themed through PT sections. Plain buttons here (not SecondaryButton): the
// design's page button is a bordered 38px box, a different control from `.util-btn`.
const PAGE_BTN =
  'border-line text-ink flex h-[38px] min-w-[38px] items-center justify-center border bg-surface px-2 text-sm font-medium transition-[color,border-color,background-color] duration-[350ms] enabled:hover:border-brand enabled:hover:text-brand disabled:cursor-default disabled:text-line'

const theme = ref<PaginatorPassThroughOptions>({
  root: `flex items-center flex-wrap mt-16`,
})
</script>
