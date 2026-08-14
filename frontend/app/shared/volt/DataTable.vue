<template>
  <DataTable
    ref="el"
    unstyled
    v-bind="filteredAttrs"
    :rows="currentRows"
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template
      #paginatorcontainer="{
        page,
        pageCount,
        rows: slotRows,
        totalRecords,
        changePageCallback,
        firstPageCallback,
        lastPageCallback,
        prevPageCallback,
        nextPageCallback,
      }"
    >
      <div
        class="flex items-center justify-between px-4 py-3 border-t border-stone-200 bg-white rounded-b-xl"
      >
        <!-- Left: injected slot (selection info, total, etc.) -->
        <div class="text-sm text-stone-400">
          <slot name="paginatorstart">
            <span>{{ totalRecords }} row{{ totalRecords !== 1 ? 's' : '' }}</span>
          </slot>
        </div>

        <!-- Right: rows per page + page info + navigation -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-stone-500">
            <span>Rows per page</span>
            <VoltSelect
              :model-value="slotRows"
              :options="[5, 10, 25, 50]"
              class="w-20"
              @update:model-value="
                (v: number) => {
                  currentRows = v
                  nextTick(() => changePageCallback(0))
                }
              "
            />
          </div>

          <span class="text-sm text-stone-500 tabular-nums whitespace-nowrap">
            Page {{ page + 1 }} of {{ pageCount }}
          </span>

          <div class="flex items-center gap-0.5">
            <SecondaryButton
              :disabled="page === 0"
              @click="firstPageCallback"
            >
              <template #icon><Icon name="ri:arrow-left-double-line" class="w-4 h-4" /></template>
            </SecondaryButton>
            <SecondaryButton
              :disabled="page === 0"
              @click="prevPageCallback"
            >
              <template #icon><Icon name="ri:arrow-left-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
            <SecondaryButton
              :disabled="page === pageCount! - 1"
              @click="nextPageCallback"
            >
              <template #icon><Icon name="ri:arrow-right-s-line" class="w-4 h-4" /></template>
            </SecondaryButton>
            <SecondaryButton
              :disabled="page === pageCount! - 1"
              @click="lastPageCallback"
            >
              <template #icon><Icon name="ri:arrow-right-double-line" class="w-4 h-4" /></template>
            </SecondaryButton>
          </div>
        </div>
      </div>
    </template>
    <template #loadingicon>
      <Icon name="ri:loader-4-line" class="w-8 h-8 animate-spin" />
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable, {
  type DataTablePassThroughOptions,
  type DataTableProps,
} from 'primevue/datatable'
import { ref, useAttrs, computed, watch, nextTick } from 'vue'
import SecondaryButton from './SecondaryButton.vue'
import VoltSelect from './Select.vue'
import { ptViewMerge } from './utils'

defineOptions({ inheritAttrs: false })

interface Props extends /* @vue-ignore */ DataTableProps {}
defineProps<Props>()

const attrs = useAttrs()

// Manage rows per page internally so the paginatorcontainer select can control it
const currentRows = ref(Number((attrs as Record<string, unknown>).rows ?? 10))
watch(
  () => (attrs as Record<string, unknown>).rows,
  (v) => {
    if (v != null) currentRows.value = Number(v)
  },
)

// Forward all attrs except rows (we bind rows explicitly)
const filteredAttrs = computed(() => {
  const { rows: _r, ...rest } = attrs as Record<string, unknown>
  return rest
})

const el = ref()
defineExpose({
  exportCSV: () => el.value.exportCSV(),
})

const theme = ref<DataTablePassThroughOptions>({
  root: `relative p-flex-scrollable:flex p-flex-scrollable:flex-col p-flex-scrollable:h-full`,
  tableContainer: `p-scrollable:relative p-flex-scrollable:flex p-flex-scrollable:flex-col p-flex-scrollable:flex-1 p-flex-scrollable:h-full`,
  header: `py-3 px-4 border-b border-stone-200
        bg-white
        text-stone-900 `,
  table: `border-spacing-0 w-full border-separate`,
  emptyMessage: `h-full`,
  emptyMessageCell: `text-center h-full`,
  thead: `p-scrollable:sticky p-scrollable:top-0 p-scrollable:z-10 p-scrollable:bg-stone-50 `,
  tbody: `p-frozen:sticky p-frozen:z-10`,
  bodyRow: `bg-white text-stone-900 transition-colors duration-100 hover:bg-stone-50! p-selectable:cursor-pointer p-selected:bg-brand-50! `,
  tfoot: `p-scrollable:bg-white p-scrollable:bottom-0 p-scrollable:z-10`,
  footer: `py-3 px-4 border-b border-stone-200
        bg-white
        text-stone-900 `,
  mask: `bg-black/50 text-stone-200 absolute z-10 flex items-center justify-center w-full h-full backdrop-blur-md`,
  column: {
    root: ``,
    headerCell: `group py-3 px-4 font-normal text-start transition-colors duration-200
            border-b border-stone-200
            bg-stone-50
            text-stone-900
            p-sortable:cursor-pointer p-sortable:select-none p-sortable:focus-visible:outline-none p-sortable:focus-visible:ring-2 p-sortable:focus-visible:ring-brand-500 p-sortable:focus-visible:ring-inset
            p-sortable:not-p-sorted:hover:bg-stone-100 p-sortable:not-p-sorted:hover:text-stone-900
            p-sorted:bg-brand-50
            p-frozen:sticky p-frozen:bg-stone-50 p-frozen:z-10
            p-frozen:[box-shadow:-1px_0_0_0_var(--color-stone-200)]
        `,
    columnHeaderContent: `flex items-center gap-2`,
    columnTitle: `text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-stone-500 group-p-sorted:text-brand-600 `,
    bodyCell: `text-start py-3 px-4 border-b border-stone-100
            p-frozen:sticky p-frozen:bg-white
            p-frozen:[box-shadow:-1px_0_0_0_var(--color-stone-200)] `,
    bodyCellContent: ``,
    footerCell: `text-start py-3 px-4 border-b border-stone-200
            bg-white
            text-stone-900
            p-frozen:sticky p-frozen:bg-white `,
    columnFooter: `font-semibold`,
    columnResizer: `block absolute top-0 end-0 m-0 w-2 h-full p-0 cursor-col-resize border border-transparent`,
    sort: ``,
    sortIcon: `w-3.5 h-3.5 text-stone-400 transition-colors duration-200
            group-p-sortable:not-group-p-sorted:group-hover:text-brand-400
            group-p-sorted:text-brand-500 `,
    pcSortBadge: {
      root: `bg-brand-500 text-white rounded-full min-w-6 h-6 inline-flex items-center justify-center text-xs font-bold`,
    },
    pcHeaderCheckbox: {
      root: `relative inline-flex select-none w-5 h-5 align-bottom`,
      input: `peer cursor-pointer disabled:cursor-default appearance-none
                absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
                border border-transparent rounded-xs`,
      box: `flex justify-center items-center rounded-lg w-5 h-5
                border border-stone-200
                bg-white
                text-stone-900
                peer-enabled:peer-hover:border-brand-400
                p-checked:border-brand-500 p-checked:bg-brand-500 p-checked:text-white
                peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2
                p-disabled:bg-stone-100 p-disabled:border-stone-200 p-disabled:opacity-50
                shadow-xs transition-colors duration-200`,
      icon: `text-sm w-3.5 h-3.5 transition-none`,
    },
    pcRowRadiobutton: {
      root: `relative inline-flex select-none w-5 h-5`,
      input: `peer cursor-pointer disabled:cursor-default appearance-none absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
                border border-transparent rounded-full`,
      box: `flex justify-center items-center rounded-full
                border border-stone-200
                bg-white
                peer-enabled:peer-hover:border-brand-400
                p-checked:border-brand-500 p-checked:bg-brand-500
                peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2
                p-invalid:border-red-500
                p-disabled:bg-stone-100 p-disabled:border-stone-200 p-disabled:opacity-50
                shadow-xs transition-colors duration-200
                w-5 h-5`,
      icon: `bg-transparent text-xs w-3 h-3 rounded-full
                transition-all duration-200 backface-hidden scale-[0.1]
                p-checked:bg-white p-checked:visible p-checked:scale-100`,
    },
    pcRowCheckbox: {
      root: `relative inline-flex select-none w-5 h-5 align-bottom`,
      input: `peer cursor-pointer disabled:cursor-default appearance-none
                absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
                border border-transparent rounded-xs`,
      box: `flex justify-center items-center rounded-lg w-5 h-5
                border border-stone-200
                bg-white
                text-stone-900
                peer-enabled:peer-hover:border-brand-400
                p-checked:border-brand-500 p-checked:bg-brand-500 p-checked:text-white
                peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2
                p-disabled:bg-stone-100 p-disabled:border-stone-200 p-disabled:opacity-50
                shadow-xs transition-colors duration-200`,
      icon: `text-sm w-3.5 h-3.5 transition-none`,
    },
    rowToggleButton: `inline-flex items-center justify-center overflow-hidden relative w-7 h-7 cursor-pointer select-none
            transition-colors duration-200 rounded-full border-none bg-transparent
            text-stone-500 enabled:hover:bg-stone-100 enabled:hover:text-stone-700
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2`,
    rowToggleIcon: ``,
    reorderableRowHandle: ``,
  },
  loadingIcon: ``,
  columnResizeIndicator: `w-px absolute z-10 hidden bg-stone-900 `,
  rowReorderIndicatorUp: `absolute hidden`,
  rowReorderIndicatorDown: `absolute hidden`,
})
</script>
