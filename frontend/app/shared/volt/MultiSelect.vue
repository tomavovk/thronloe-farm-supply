<template>
  <MultiSelect
    unstyled
    :show-toggle-all="false"
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template #dropdownicon>
      <Icon
        name="ri:arrow-down-s-line"
        class="h-4 w-4 opacity-50"
      />
    </template>
    <template #loadingicon>
      <Icon
        name="ri:loader-4-line"
        class="h-4 w-4 animate-spin"
      />
    </template>
    <template #filtericon>
      <Icon
        name="ri:search-line"
        class="h-4 w-4 text-stone-400"
      />
    </template>
    <template #clearicon="{ clearCallback }">
      <Icon
        name="ri:close-line"
        class="absolute top-1/2 -mt-2 inset-e-10 h-4 w-4 text-stone-400 hover:text-stone-600 cursor-pointer"
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
  </MultiSelect>
</template>

<script setup lang="ts">
import MultiSelect, {
  type MultiSelectPassThroughMethodOptions,
  type MultiSelectPassThroughOptions,
  type MultiSelectProps,
} from 'primevue/multiselect'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ MultiSelectProps {}
withDefaults(defineProps<Props>(), {
  display: 'comma',
  showToggleAll: false,
})

function optionClass({ context }: MultiSelectPassThroughMethodOptions) {
  return [
    'relative flex items-center gap-2 min-h-8 px-3 py-1.5 rounded-full cursor-pointer',
    'text-sm font-normal text-stone-900',
    'transition-colors duration-100',
    context.focused && !context.selected && 'bg-stone-100',
    context.selected && 'bg-stone-100 font-medium',
    (context.focused || context.selected) && 'option-active',
    context.disabled && 'pointer-events-none opacity-50',
  ]
}

const theme = ref<MultiSelectPassThroughOptions>({
  root: `inline-flex relative cursor-pointer select-none rounded-full p-fluid:flex
        h-9 items-center
        bg-stone-100
        border border-transparent outline-none
        hover:border-stone-300
        p-focus:border-stone-400
        p-focus:ring-2 p-focus:ring-stone-900/20
        p-disabled:opacity-50 p-disabled:pointer-events-none
        [&.p-invalid]:border-red-400!
        transition-[border-color,box-shadow] duration-150`,

  labelContainer: `overflow-hidden flex flex-auto w-[1%] cursor-pointer h-full`,

  label: `flex flex-wrap gap-1 items-center flex-auto min-w-0 h-full
        ps-4 pe-1
        text-sm text-stone-900 bg-transparent border-none outline-none
        font-normal
        [&[data-p~='placeholder']]:text-stone-400! `,

  chipItem: `inline-flex m-0.5`,

  pcChip: {
    root: `inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1
            text-xs font-medium
            bg-stone-100
            text-stone-600
            border border-stone-200 `,
  },

  dropdown: `flex items-center justify-center shrink-0 bg-transparent
        text-stone-500 w-9 rounded-e-lg`,

  overlay: `absolute top-0 left-0 z-50 rounded-2xl p-portal-self:min-w-full min-w-32
        mt-1 overflow-hidden
        bg-white
        border border-stone-200
        shadow-md`,

  header: ({ props }: MultiSelectPassThroughMethodOptions) =>
    props.filter ? 'pt-2 pb-1 px-2' : 'hidden',

  pcHeaderCheckbox: {
    root: `relative inline-flex select-none w-5 h-5 align-bottom shrink-0`,
    input: `peer cursor-pointer disabled:cursor-default appearance-none
            absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
            border border-transparent rounded-xs`,
    box: `flex justify-center items-center rounded-lg w-5 h-5
            border border-stone-200
            bg-white
            text-stone-900
            peer-enabled:peer-hover:border-stone-300
            p-checked:border-stone-900 p-checked:bg-stone-900 p-checked:text-stone-50
            peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-stone-950 peer-focus-visible:ring-offset-2
            p-disabled:bg-stone-100 p-disabled:border-stone-200 p-disabled:opacity-50
            shadow-xs transition-colors duration-200`,
    icon: `text-sm w-3.5 h-3.5 transition-none`,
  },

  pcFilterContainer: { root: `relative flex-1` },

  pcFilter: {
    root: `w-full h-9 appearance-none rounded-full outline-none border-0
            bg-stone-100
            text-sm text-stone-900
            enabled:focus:ring-2 enabled:focus:ring-stone-900/20
            ps-4 pe-10
            transition-shadow duration-150`,
  },

  pcFilterIconContainer: { root: `absolute top-1/2 -mt-2 leading-none end-3` },

  listContainer: `overflow-auto max-h-72`,

  list: `m-0 p-1 list-none flex flex-col gap-1`,

  optionGroup: `px-2 py-1.5 text-xs uppercase tracking-wide text-stone-500 font-medium`,

  option: optionClass,

  optionLabel: `flex-1 text-sm`,

  pcOptionCheckbox: {
    root: `relative inline-flex select-none w-4 h-4 align-bottom shrink-0 order-last ml-auto`,
    input: `peer appearance-none absolute inset-0 opacity-0`,
    box: `flex justify-center items-center w-4 h-4
            text-transparent p-checked:text-brand-500
            transition-colors duration-150`,
    icon: `w-3.5 h-3.5`,
  },

  emptyMessage: `px-2 py-1.5 text-sm text-stone-500 text-center`,

  transition: {
    enterFromClass: 'opacity-0 scale-95 translate-y-1',
    enterActiveClass: 'transition duration-150 ease-out',
    leaveActiveClass: 'transition duration-100 ease-in',
    leaveToClass: 'opacity-0 scale-95 translate-y-1',
  },
})
</script>
