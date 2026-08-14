<template>
    <ToggleSwitch
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import ToggleSwitch, { type ToggleSwitchPassThroughOptions, type ToggleSwitchProps } from 'primevue/toggleswitch';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ ToggleSwitchProps {}
defineProps<Props>();

const theme = ref<ToggleSwitchPassThroughOptions>({
    root: `inline-flex relative w-10 h-6 cursor-pointer select-none
        rounded-full
        disabled:pointer-events-none disabled:opacity-50
        focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/30 focus-visible:ring-offset-2
        `,

    input: `sr-only`,

    slider: `absolute inset-0 rounded-full transition-colors duration-200 ease-in-out
        bg-stone-200
        p-checked:bg-brand-500 `,

    handle: `absolute top-0.5 start-0.5 w-5 h-5 rounded-full
        bg-white
        shadow-sm
        transition-[transform,background-color] duration-200 ease-in-out
        p-checked:translate-x-4 `
});
</script>
