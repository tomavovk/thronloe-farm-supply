<template>
    <Timeline
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Timeline>
</template>

<script setup lang="ts">
import Timeline, { type TimelinePassThroughOptions, type TimelineProps } from 'primevue/timeline';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ TimelineProps {}
defineProps<Props>();

const theme = ref<TimelinePassThroughOptions>({
    root: `flex flex-col p-horizontal:flex-row p-alternate:flex-row`,

    event: `flex min-h-14 p-horizontal:flex-col p-horizontal:flex-1`,

    eventOpposite: `flex-1 p-align-left:text-left p-align-right:text-right
        text-sm text-stone-500 py-0.5`,

    eventSeparator: `flex flex-col items-center gap-0
        p-horizontal:flex-row p-horizontal:min-w-14`,

    eventMarker: `flex items-center justify-center
        w-4 h-4 rounded-full shrink-0
        bg-stone-300
        border-2 border-white
        ring-2 ring-stone-200
        z-10`,

    eventConnector: `flex-1 w-px bg-stone-200
        p-horizontal:w-full p-horizontal:h-px`,

    eventContent: `flex-1 p-align-left:text-left p-align-right:text-right
        pb-5 py-0.5 ps-3
        p-horizontal:ps-0 p-horizontal:pt-3 p-horizontal:pb-0`
});
</script>
