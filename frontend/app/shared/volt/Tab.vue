<template>
    <Tab
        unstyled
        :value="props.value"
        :pt="theme"
        :ptOptions="{ mergeProps: ptViewMerge }"
    >
        <slot></slot>
    </Tab>
</template>

<script setup lang="ts">
import Tab, { type TabPassThroughOptions, type TabProps } from 'primevue/tab';
import { computed, inject, type ComputedRef } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ TabProps {}
const props = defineProps<Props>();

const variant = inject<ComputedRef<'pill' | 'underline'>>('tabVariant', computed(() => 'pill'));

const theme = computed<TabPassThroughOptions>(() =>
    variant.value === 'underline'
        ? {
              root: `px-3.5 py-2 -mb-px text-sm font-medium cursor-pointer select-none whitespace-nowrap outline-none
                  border-b-2 border-transparent
                  text-stone-500
                  hover:text-stone-700
                  transition-colors duration-100
                  data-[p-active=true]:border-stone-900
                  data-[p-active=true]:text-stone-900 `,
          }
        : {
              root: `px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-100 cursor-pointer select-none whitespace-nowrap outline-none
                  text-stone-500
                  hover:text-stone-700
                  data-[p-active=true]:bg-white
                  data-[p-active=true]:text-stone-900
                  data-[p-active=true]:shadow-sm`,
          },
);
</script>
