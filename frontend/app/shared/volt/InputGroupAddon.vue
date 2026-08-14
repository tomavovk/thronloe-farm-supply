<template>
    <InputGroupAddon
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot />
    </InputGroupAddon>
</template>

<script setup lang="ts">
import InputGroupAddon, { type InputGroupAddonPassThroughOptions, type InputGroupAddonProps } from 'primevue/inputgroupaddon';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ InputGroupAddonProps {}
defineProps<Props>();

const theme = ref<InputGroupAddonPassThroughOptions>({
    root: `inline-flex items-center justify-center px-3 h-9
        text-sm text-stone-400
        rounded-full min-w-10`
});
</script>
