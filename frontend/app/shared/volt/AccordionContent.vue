<template>
    <AccordionContent
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot />
    </AccordionContent>
</template>

<script setup lang="ts">
import AccordionContent, { type AccordionContentPassThroughOptions, type AccordionContentProps } from 'primevue/accordioncontent';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ AccordionContentProps {}
defineProps<Props>();

const theme = ref<AccordionContentPassThroughOptions>({
    root: `overflow-hidden`,

    content: `px-6 pb-6 max-w-[68ch] text-sm leading-[1.6] text-muted`,

    transition: {
        enterFromClass: 'max-h-0 opacity-0',
        enterActiveClass: 'transition-[max-height,opacity] duration-200 ease-out overflow-hidden',
        enterToClass: 'max-h-250 opacity-100',
        leaveFromClass: 'max-h-250 opacity-100',
        leaveActiveClass: 'transition-[max-height,opacity] duration-150 ease-in overflow-hidden',
        leaveToClass: 'max-h-0 opacity-0'
    }
});
</script>
