<template>
    <AccordionPanel
        :value="props.value"
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot />
    </AccordionPanel>
</template>

<script setup lang="ts">
import AccordionPanel, { type AccordionPanelPassThroughOptions, type AccordionPanelProps } from 'primevue/accordionpanel';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ AccordionPanelProps {
    // Required upstream; declared here so it is forwarded explicitly rather than
    // relying on attribute fallthrough the type checker cannot see.
    value: string | number | undefined
}
const props = defineProps<Props>();

const theme = ref<AccordionPanelPassThroughOptions>({
    root: `border-b border-line last:border-b-0`
});
</script>
