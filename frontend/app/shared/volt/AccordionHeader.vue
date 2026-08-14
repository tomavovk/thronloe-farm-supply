<template>
    <AccordionHeader
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>

        <!-- The design's `.faq-toggle`: a 34px bordered box holding a chevron that
             turns 90° when the panel opens. Rotation is driven by the header's own
             `data-p-active` (via `group`), so no slot-prop typing is needed. -->
        <template #toggleicon>
            <span
                class="border-line text-muted group-hover:border-brand group-hover:text-brand flex h-[34px] w-[34px] shrink-0 items-center justify-center border bg-panel transition-[color,border-color,background-color] duration-[350ms]"
            >
                <UiGlyph
                    name="chevron-right"
                    class="text-[14px] transition-transform duration-[350ms] group-data-[p-active=true]:rotate-90"
                />
            </span>
        </template>
    </AccordionHeader>
</template>

<script setup lang="ts">
import AccordionHeader, { type AccordionHeaderPassThroughOptions, type AccordionHeaderProps } from 'primevue/accordionheader';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ AccordionHeaderProps {}
defineProps<Props>();

const theme = ref<AccordionHeaderPassThroughOptions>({
    root: `group flex items-center justify-between w-full
        gap-4 p-6
        text-base font-medium text-left
        text-ink
        cursor-pointer select-none
        disabled:pointer-events-none disabled:opacity-50
        transition-colors duration-[350ms]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`
});
</script>
