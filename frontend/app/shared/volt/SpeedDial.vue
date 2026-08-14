<template>
    <SpeedDial
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </SpeedDial>
</template>

<script setup lang="ts">
import SpeedDial, { type SpeedDialPassThroughOptions, type SpeedDialProps } from 'primevue/speeddial';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ SpeedDialProps {}
defineProps<Props>();

const theme = ref<SpeedDialPassThroughOptions>({
    root: `relative inline-flex`,

    pcButton: {
        root: `w-12 h-12 rounded-full shadow-lg
            inline-flex items-center justify-center cursor-pointer select-none
            bg-stone-900 text-stone-50 border border-stone-900
            hover:bg-stone-800 hover:border-stone-800
            active:bg-stone-700
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950/30 focus-visible:ring-offset-2`
    },

    list: `m-0 p-0 list-none flex gap-2 items-center
        p-direction-up:flex-col-reverse
        p-direction-down:flex-col
        p-direction-left:flex-row-reverse
        p-direction-right:flex-row`,

    item: `transform transition-[transform,opacity] duration-200`,

    pcAction: {
        root: `w-10 h-10 rounded-full shadow-md
            inline-flex items-center justify-center cursor-pointer select-none
            bg-white
            text-stone-700
            border border-stone-200
            hover:bg-stone-50
            hover:border-stone-300
            active:bg-stone-100
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950/20`
    },

    actionIcon: `w-4 h-4`,

    mask: `fixed inset-0 bg-black/20 `,

});
</script>
