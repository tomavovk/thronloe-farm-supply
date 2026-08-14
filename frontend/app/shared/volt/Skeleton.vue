<template>
    <Skeleton
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import Skeleton, { type SkeletonPassThroughOptions, type SkeletonProps } from 'primevue/skeleton';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ SkeletonProps {}
defineProps<Props>();

// Design has no radius scale to speak of (cards sit at 2px) and its neutrals are
// the panel/line pair, so the vendored stone-200 + rounded-xl are replaced.
// NOTE: `width`/`height` land as inline styles — an aspect-ratio class can't win
// against them, so size media placeholders with a wrapper, not height="0".
const theme = ref<SkeletonPassThroughOptions>({
    root: `overflow-hidden bg-line animate-pulse rounded-[2px] p-circle:rounded-full`
});
</script>
