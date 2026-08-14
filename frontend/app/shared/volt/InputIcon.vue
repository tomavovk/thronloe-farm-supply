<template>
    <InputIcon
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot />
    </InputIcon>
</template>

<script setup lang="ts">
import InputIcon, { type InputIconPassThroughOptions, type InputIconProps } from 'primevue/inputicon';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ InputIconProps {}
defineProps<Props>();

const theme = ref<InputIconPassThroughOptions>({
    root: `absolute top-1/2 -translate-y-1/2 start-3.5 text-stone-400 pointer-events-none`
});
</script>
