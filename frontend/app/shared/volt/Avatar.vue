<template>
    <Avatar
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Avatar>
</template>

<script setup lang="ts">
import Avatar, { type AvatarPassThroughOptions, type AvatarProps } from 'primevue/avatar';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ AvatarProps {}
defineProps<Props>();

const theme = ref<AvatarPassThroughOptions>({
    root: `inline-flex items-center justify-center relative overflow-hidden
        w-9 h-9 rounded-full
        bg-stone-200
        text-stone-700
        text-sm font-medium select-none shrink-0
        p-lg:w-12 p-lg:h-12 p-lg:text-base
        p-xl:w-16 p-xl:h-16 p-xl:text-xl
        p-square:rounded-xl`,

    label: `font-medium`,

    icon: `w-4 h-4 p-lg:w-5 p-lg:h-5 p-xl:w-6 p-xl:h-6`,

    image: `w-full h-full object-cover rounded-[inherit]`
});
</script>
