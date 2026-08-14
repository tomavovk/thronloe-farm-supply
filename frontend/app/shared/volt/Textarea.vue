<template>
    <Textarea
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import Textarea, { type TextareaPassThroughOptions, type TextareaProps } from 'primevue/textarea';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ TextareaProps {}
defineProps<Props>();

// Matches InputText, which is the design's `.co-field textarea`: same 1px line
// border and padding, vertical resize only, 96px floor.
const theme = ref<TextareaPassThroughOptions>({
    root: `appearance-none w-full outline-none
        border border-line
        min-h-24 px-3 py-[0.7rem]
        bg-surface
        text-sm font-normal leading-[1.55] text-ink resize-y
        placeholder:text-subtle
        enabled:hover:border-brand
        enabled:focus:outline-2 enabled:focus:outline-brand enabled:focus:-outline-offset-1
        disabled:pointer-events-none disabled:opacity-50
        [&.p-invalid]:border-error!
        transition-colors duration-[350ms]`
});
</script>
