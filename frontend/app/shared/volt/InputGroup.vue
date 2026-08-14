<template>
    <InputGroup
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot />
    </InputGroup>
</template>

<script setup lang="ts">
import InputGroup, { type InputGroupPassThroughOptions, type InputGroupProps } from 'primevue/inputgroup';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ InputGroupProps {}
defineProps<Props>();

const theme = ref<InputGroupPassThroughOptions>({
    root: `input-group flex items-stretch w-full
        bg-stone-100
        rounded-full
        border border-transparent
        hover:border-stone-300
        focus-within:border-stone-400
        focus-within:ring-2 focus-within:ring-stone-900/20
        transition-[border-color,box-shadow] duration-150
        [&>*:not(:first-child)]:rounded-s-none!
        [&>*:not(:last-child)]:rounded-e-none!
        [&>*:not(:first-child)_input]:rounded-s-none!
        [&>*:not(:last-child)_input]:rounded-e-none!`
});
</script>
