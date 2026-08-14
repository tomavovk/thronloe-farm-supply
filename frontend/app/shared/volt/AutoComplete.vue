<template>
    <AutoComplete
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #dropdownicon>
            <Icon name="ri:arrow-down-s-line" class="h-4 w-4 opacity-50" />
        </template>
        <template #loadingicon>
            <Icon name="ri:loader-4-line" class="h-4 w-4 animate-spin" />
        </template>
        <template #clearicon="{ clearCallback }">
            <Icon name="ri:close-line" class="absolute top-1/2 -mt-2 inset-e-10 h-4 w-4 text-stone-400 hover:text-stone-600 cursor-pointer" @click="clearCallback" />
        </template>
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </AutoComplete>
</template>

<script setup lang="ts">
import AutoComplete, { type AutoCompletePassThroughOptions, type AutoCompleteProps } from 'primevue/autocomplete';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ AutoCompleteProps {}
defineProps<Props>();

const theme = ref<AutoCompletePassThroughOptions>({
    root: `relative inline-flex p-fluid:flex`,

    pcInputText: {
        root: `appearance-none rounded-full outline-none w-full
            border border-transparent
            h-9 px-4
            bg-stone-100
            text-sm text-stone-900
            placeholder:text-stone-400
            enabled:hover:border-stone-300
            enabled:focus:border-stone-400
            enabled:focus:ring-2 enabled:focus:ring-stone-900/20
            disabled:pointer-events-none disabled:opacity-50
            [&.p-invalid]:border-red-400!
            transition-[border-color,box-shadow] duration-150`
    },

    inputMultiple: `flex flex-wrap items-center gap-1 flex-1 min-w-0
        rounded-full px-3 py-1 min-h-9
        border border-transparent
        bg-stone-100
        hover:border-stone-300
        focus-within:border-stone-400
        focus-within:ring-2 focus-within:ring-stone-900/20
        [&.p-invalid]:border-red-400!
        transition-[border-color,box-shadow] duration-150`,

    chipItem: ``,

    pcChip: {
        root: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5
            text-xs font-medium
            bg-white
            text-stone-700 `
    },

    inputChip: `flex-1 min-w-16`,

    loader: `absolute top-1/2 -mt-2 end-3 h-4 w-4 animate-spin text-stone-400`,

    dropdown: `flex items-center justify-center shrink-0 bg-transparent
        text-stone-500 w-9 rounded-e-xl`,

    overlay: `absolute top-0 left-0 z-50 rounded-2xl min-w-32 w-full
        mt-1 overflow-hidden
        bg-white
        border border-stone-200
        shadow-md`,

    listContainer: `overflow-auto max-h-72`,

    list: `m-0 p-1 list-none flex flex-col`,

    optionGroup: `px-2 py-1.5 text-xs uppercase tracking-wide text-stone-500 font-medium`,

    option: ({ context }: any) => ({
        class: [
            'relative flex items-center gap-2 min-h-8 px-3 py-1.5 rounded-full cursor-pointer',
            'text-sm font-normal text-stone-900',
            'transition-colors duration-100',
            context.focused && 'bg-stone-100',
            context.selected && 'bg-stone-100 font-medium',
            context.focused && context.selected && 'bg-stone-200',
        ]
    }),

    emptyMessage: `px-2 py-3 text-sm text-stone-500 text-center`,

    transition: {
        enterFromClass: 'opacity-0 scale-95 translate-y-1',
        enterActiveClass: 'transition duration-150 ease-out',
        leaveActiveClass: 'transition duration-100 ease-in',
        leaveToClass: 'opacity-0 scale-95 translate-y-1'
    }
});
</script>
