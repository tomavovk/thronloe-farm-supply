<template>
    <Card
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card, { type CardPassThroughOptions, type CardProps } from 'primevue/card';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ CardProps {}
defineProps<Props>();

const theme = ref<CardPassThroughOptions>({
    root: `bg-white
        rounded-3xl border border-stone-200
        shadow-xl shadow-stone-200/70 `,
    header: ``,
    body: `p-6 flex flex-col gap-6 h-full`,
    title: `text-lg font-semibold text-stone-900 leading-tight`,
    subtitle: `text-xs font-normal text-stone-500 -mt-4`,
    content: `flex-1 flex flex-col`,
    footer: ``
});
</script>
