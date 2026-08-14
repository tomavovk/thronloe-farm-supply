<template>
  <Select
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <!-- The design's own square-cap chevron; it also rotates while the panel is open. -->
    <template #dropdownicon>
      <UiGlyph
        name="chevron"
        class="text-muted text-[14px] transition-transform duration-[350ms] group-aria-expanded:rotate-180"
      />
    </template>
    <template #loadingicon>
      <svg
        class="h-4 w-4 animate-spin text-subtle"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M12 3a9 9 0 1 0 9 9"
          stroke-linecap="square"
        />
      </svg>
    </template>
    <template #filtericon>
      <SlIcon
        name="magnifying-glass"
        class="text-muted text-[15px]"
      />
    </template>
    <template #clearicon="{ clearCallback }">
      <UiGlyph
        name="close"
        class="text-muted hover:text-ink inset-e-8 absolute top-1/2 -mt-2 cursor-pointer text-[15px]"
        @click="clearCallback"
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
  </Select>
</template>

<script setup lang="ts">
import Select, {
  type SelectPassThroughMethodOptions,
  type SelectPassThroughOptions,
  type SelectProps,
} from 'primevue/select'
import { computed, useAttrs } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ SelectProps {
  size?: 'sm' | 'md'
}
const props = withDefaults(defineProps<Props>(), {
  checkmark: true,
  highlightOnSelect: true,
  size: 'md',
})

// Detect external `p-invalid` so we can switch the placeholder color in PT.
const attrs = useAttrs()

const isInvalid = computed(() => {
  if (typeof props.invalid === 'boolean') {
    return props.invalid
  }

  const tokens: string[] = []
  const walk = (c: unknown) => {
    if (!c) {
      return
    }

    if (typeof c === 'string') {
      tokens.push(...c.split(/\s+/))
    } else if (Array.isArray(c)) {
      c.forEach(walk)
    } else if (typeof c === 'object') {
      for (const [k, v] of Object.entries(c as Record<string, unknown>)) {
        if (v) {
          tokens.push(k)
        }
      }
    }
  }
  walk(attrs.class)
  return tokens.includes('p-invalid')
})

// Option rows mirror the design's `.search-popup-item`: flat, square, panel tint
// on hover, and the selected row held at that tint.
const optionClass = ({ context }: SelectPassThroughMethodOptions<any>) => [
  'relative flex cursor-pointer items-center gap-2 px-3 py-2',
  'text-sm font-normal text-ink',
  'transition-colors duration-150',
  context.focused && 'bg-surface-hover',
  context.selected && 'bg-panel font-semibold',
  context.disabled && 'pointer-events-none opacity-50',
]

const optionCheckIconClass = ({ context }: SelectPassThroughMethodOptions<any>) => [
  'w-4 h-4 shrink-0 text-brand',
  context.selected ? 'opacity-100' : 'hidden',
]

const sm = computed(() => props.size === 'sm')

// Trigger styling comes from the design's `.filter-select`: 1px line border that
// turns brand-red on hover, surface background, small text, square corners.
const theme = computed<SelectPassThroughOptions>(() => ({
  root: `group inline-flex relative cursor-pointer select-none w-full items-center
        bg-surface
        border border-line outline-none
        hover:border-brand
        p-focus:border-brand
        p-disabled:opacity-50 p-disabled:pointer-events-none
        [&.p-invalid:not(:focus-within)]:border-error
        transition-colors duration-[350ms]`,

  label: `flex items-center h-full flex-auto w-[1%] min-w-0 truncate
        ${sm.value ? 'px-2.5 py-1.5' : 'px-3 py-2'} text-sm
        [.p-select-clearable_&]:pe-9
        [&>*]:min-w-0 [&>*]:truncate
        font-normal text-ink bg-transparent border-none outline-none
        ${
          isInvalid.value
            ? `[&[data-p~='placeholder']]:text-error! `
            : `[&[data-p~='placeholder']]:text-subtle! `
        }`,

  dropdown: `flex items-center justify-center shrink-0 bg-transparent
        text-muted ${sm.value ? 'w-7' : 'w-8'} pe-2`,

  overlay: `absolute top-0 left-0 z-50 p-portal-self:min-w-full min-w-32
        mt-1 overflow-hidden
        bg-surface
        border border-line
        shadow-dropdown`,

  header: `pt-2 pb-1 px-2`,

  pcFilterContainer: { root: `relative` },

  pcFilter: {
    root: `w-full appearance-none outline-none border border-line
            bg-surface
            text-sm text-ink
            focus:border-brand
            ps-3 pe-10 py-2
            transition-colors duration-[350ms]`,
  },

  pcFilterIconContainer: { root: `absolute top-1/2 -mt-2 leading-none end-3` },

  listContainer: `overflow-auto overscroll-contain max-h-72`,

  list: `m-0 p-0 list-none flex flex-col`,

  optionGroup: `px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-muted font-semibold`,

  option: optionClass,

  optionLabel: `flex-1`,

  optionCheckIcon: optionCheckIconClass,

  optionBlankIcon: `w-4 h-4 shrink-0 opacity-0`,

  emptyMessage: `px-3 py-2 pb-4 text-sm text-muted text-center`,

  virtualScroller: ``,

  transition: {
    enterFromClass: 'opacity-0 -translate-y-1',
    enterActiveClass: 'transition duration-150 ease-out',
    leaveActiveClass: 'transition duration-100 ease-in',
    leaveToClass: 'opacity-0 -translate-y-1',
  },
}))
</script>
