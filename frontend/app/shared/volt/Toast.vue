<template>
  <Toast
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge
    }"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </Toast>
</template>

<script setup lang="ts">
import Toast, { type ToastPassThroughOptions, type ToastProps } from 'primevue/toast';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ ToastProps {}
defineProps<Props>();

const theme = ref<ToastPassThroughOptions>({
    root: `w-96 rounded-xl whitespace-pre-line break-words
        p-top-center:-translate-x-1/2 p-bottom-center:-translate-x-1/2
        p-center:min-w-[20vw] p-center:-translate-x-1/2 p-center:-translate-y-1/2`,
    message: ` mb-3 not-p-custom:border not-p-custom:rounded-xl not-p-custom:shadow-sm relative
        bg-white
        border-stone-200 `,
    messageContent: `flex items-start px-4 py-3.5 pr-14`,
    messageIcon: `hidden`,
    messageText: `flex flex-col gap-0.5`,
    summary: `text-sm font-medium
        p-info:text-blue-600
        p-success:text-stone-900
        p-warn:text-yellow-600
        p-error:text-red-600
        p-secondary:text-stone-700
        p-contrast:text-stone-900 `,
    detail: `text-sm text-stone-500 `,
    buttonContainer: `absolute top-2.5 right-2.5`,
    closeButton: `flex items-center justify-center cursor-pointer p-0
        w-7 h-7 rounded-full
        bg-stone-100
        border border-transparent
        text-stone-900
        hover:border-stone-300
        transition-[border-color] duration-150`,
    closeIcon: `w-3 h-3`,
    transition: {
        enterFromClass: 'opacity-0 translate-y-1/2',
        enterActiveClass: 'transition-all duration-500',
        leaveFromClass: 'max-h-250',
        leaveActiveClass: 'transition-all duration-500',
        leaveToClass: 'max-h-0 opacity-0 mb-0 overflow-hidden'
    }
});
</script>
