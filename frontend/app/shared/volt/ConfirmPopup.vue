<template>
    <ConfirmPopup
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import ConfirmPopup, { type ConfirmPopupPassThroughOptions, type ConfirmPopupProps } from 'primevue/confirmpopup';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ ConfirmPopupProps {}
defineProps<Props>();

const theme = ref<ConfirmPopupPassThroughOptions>({
    root: `rounded-xl border border-stone-200
        bg-white
        shadow-xl shadow-stone-200/70
        min-w-56 max-w-72 z-50`,
    content: `flex items-start gap-3 p-4 pb-3`,
    icon: `w-4 h-4 text-amber-500 shrink-0 mt-0.5`,
    message: `text-sm text-stone-700 `,
    footer: `flex items-center justify-end gap-2 px-4 pb-4`,
    pcRejectButton: {
        root: `px-3 py-1.5 rounded-xl text-xs font-medium border border-stone-200
            text-stone-600 hover:bg-stone-50
            transition-colors cursor-pointer`,
    },
    pcAcceptButton: {
        root: `px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500 hover:bg-red-600
            text-white transition-colors cursor-pointer`,
    },

    transition: {
        enterFromClass: 'opacity-0 scale-95',
        enterActiveClass: 'transition-all duration-150 ease-out',
        leaveActiveClass: 'transition-all duration-100 ease-in',
        leaveToClass: 'opacity-0 scale-95',
    },
});
</script>
