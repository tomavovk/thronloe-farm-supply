<template>
  <Chip
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template #removeicon="{ removeCallback, keydownCallback }">
      <button
        class="ml-0.5 -mr-0.5 flex items-center justify-center w-4 h-4 rounded-full text-stone-400 hover:text-white hover:bg-brand-500 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
        @click="removeCallback"
        @keydown="keydownCallback"
      >
        <svg
          class="w-3 h-3"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
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
  </Chip>
</template>

<script setup lang="ts">
import Chip, { type ChipPassThroughOptions, type ChipProps } from 'primevue/chip'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ ChipProps {}
defineProps<Props>()

const theme = ref<ChipPassThroughOptions>({
  root: `inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1
        text-xs font-medium
        bg-stone-100
        text-stone-600
        border border-stone-200
        hover:bg-stone-200
        hover:border-stone-300
        transition-all duration-150
        has-[img]:ps-1 p-removable:pe-1.5`,
  image: `rounded-full w-5 h-5`,
})
</script>
