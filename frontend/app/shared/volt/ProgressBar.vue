<template>
    <ProgressBar
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </ProgressBar>
</template>

<script setup lang="ts">
import ProgressBar, { type ProgressBarPassThroughOptions, type ProgressBarProps } from 'primevue/progressbar';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ ProgressBarProps {}
defineProps<Props>();

const theme = ref<ProgressBarPassThroughOptions>({
    root: `relative overflow-hidden h-2 rounded-full
        bg-stone-100
        p-indeterminate:before:absolute p-indeterminate:before:inset-y-0
        p-indeterminate:before:animate-[progressbar-indeterminate_1.5s_infinite_linear]
        p-indeterminate:before:bg-stone-900
        p-indeterminate:before:rounded-full`,

    value: `h-full rounded-full transition-[width] duration-300
        bg-stone-900
        p-success:bg-green-500
        p-info:bg-sky-500
        p-warn:bg-amber-500
        p-danger:bg-red-500 `,

    label: `hidden`
});
</script>
