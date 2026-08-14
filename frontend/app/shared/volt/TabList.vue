<template>
    <TabList
        unstyled
        :pt="theme"
        :ptOptions="{ mergeProps: ptViewMerge }"
    >
        <slot></slot>
    </TabList>
</template>

<script setup lang="ts">
import TabList, { type TabListPassThroughOptions } from 'primevue/tablist';
import { computed, provide } from 'vue';
import { ptViewMerge } from './utils';

const props = withDefaults(defineProps<{ variant?: 'pill' | 'underline' }>(), {
    variant: 'pill',
});

provide('tabVariant', computed(() => props.variant));

const theme = computed<TabListPassThroughOptions>(() =>
    props.variant === 'underline'
        ? {
              root: `flex items-center border-b border-stone-200 gap-0`,
              tabList: `flex items-center gap-0`,
              activeBar: `hidden`,
              prevButton: `hidden`,
              nextButton: `hidden`,
          }
        : {
              root: `flex items-center bg-stone-100 rounded-full p-1 gap-0.5`,
              tabList: `flex items-center gap-0.5`,
              activeBar: `hidden`,
              prevButton: `hidden`,
              nextButton: `hidden`,
          },
);
</script>
