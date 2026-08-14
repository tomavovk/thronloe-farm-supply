<template>
    <AvatarGroup
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot />
    </AvatarGroup>
</template>

<script setup lang="ts">
import AvatarGroup, { type AvatarGroupPassThroughOptions, type AvatarGroupProps } from 'primevue/avatargroup';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ AvatarGroupProps {}
defineProps<Props>();

const theme = ref<AvatarGroupPassThroughOptions>({
    root: `flex items-center [&>[data-pc-name=avatar]]:ring-2 [&>[data-pc-name=avatar]]:ring-white [&>[data-pc-name=avatar]]:ml-[-0.5rem] first:[&>[data-pc-name=avatar]]:ml-0`
});
</script>
