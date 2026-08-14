<template>
    <Message
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Message>
</template>

<script setup lang="ts">
import Message, { type MessagePassThroughOptions, type MessageProps } from 'primevue/message';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ MessageProps {}
defineProps<Props>();

const theme = ref<MessagePassThroughOptions>({
    root: `flex items-start gap-2 rounded-xl border px-4 py-3 text-sm
        p-info:bg-sky-50 p-info:border-sky-200 p-info:text-sky-800
        p-success:bg-success-soft p-success:border-success/30 p-success:text-ink
        p-warn:bg-amber-50 p-warn:border-amber-200 p-warn:text-amber-800
        p-error:bg-error-soft p-error:border-error/30 p-error:text-ink
        p-secondary:bg-panel p-secondary:border-line p-secondary:text-muted
        p-contrast:bg-surface-dark p-contrast:border-surface-dark p-contrast:text-white
          `,

    contentWrapper: `flex items-start gap-2 flex-1`,

    content: `flex-1 leading-relaxed`,

    icon: `w-4 h-4 shrink-0 mt-0.5`,

    text: ``,

    closeButton: `ms-auto -my-0.5 flex items-center justify-center w-6 h-6 rounded-xl
        opacity-60 hover:opacity-100 cursor-pointer
        hover:bg-black/10
        transition-all duration-150
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current`,

    closeIcon: `w-3.5 h-3.5`,

    transition: {
        enterFromClass: 'opacity-0 -translate-y-1',
        enterActiveClass: 'transition-all duration-200 ease-out',
        leaveActiveClass: 'transition-all duration-150 ease-in',
        leaveToClass: 'opacity-0 -translate-y-1'
    }
});
</script>
