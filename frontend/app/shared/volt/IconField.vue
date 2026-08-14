<template>
    <IconField
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot />
    </IconField>
</template>

<script setup lang="ts">
import IconField, { type IconFieldPassThroughOptions, type IconFieldProps } from 'primevue/iconfield';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ IconFieldProps {}
defineProps<Props>();

const theme = ref<IconFieldPassThroughOptions>({
    root: `relative inline-flex p-fluid:flex`
});
</script>
