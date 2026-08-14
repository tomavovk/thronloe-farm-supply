<template>
    <FileUpload
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </FileUpload>
</template>

<script setup lang="ts">
import FileUpload, { type FileUploadPassThroughOptions, type FileUploadProps } from 'primevue/fileupload';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ FileUploadProps {}
defineProps<Props>();

const theme = ref<FileUploadPassThroughOptions>({
    root: ``,

    input: `hidden`,

    header: `flex items-center justify-between gap-2 flex-wrap
        px-4 py-3
        border border-b-0 border-stone-200
        bg-stone-50
        rounded-t-xl`,

    pcChooseButton: {
        root: `inline-flex cursor-pointer select-none items-center justify-center
            px-3 py-1.5 gap-1.5 rounded-xl text-sm
            bg-stone-900 text-stone-50 border border-stone-900
            hover:bg-stone-800 hover:border-stone-800
            active:bg-stone-700
            transition-colors duration-200`
    },

    pcUploadButton: {
        root: `inline-flex cursor-pointer select-none items-center justify-center
            px-3 py-1.5 gap-1.5 rounded-xl text-sm
            bg-stone-100 text-stone-900 border border-stone-200
            hover:bg-stone-200 hover:border-stone-200
            transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none`
    },

    pcCancelButton: {
        root: `inline-flex cursor-pointer select-none items-center justify-center
            px-3 py-1.5 gap-1.5 rounded-xl text-sm
            bg-transparent text-stone-700 border border-stone-200
            hover:bg-stone-100 hover:border-stone-200
            transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none`
    },

    content: `relative
        border border-stone-200
        rounded-b-xl p-4
        bg-white `,

    pcProgressBar: {
        root: `absolute top-0 left-0 right-0 h-0.5 rounded-none`,
        value: `h-full bg-stone-900 transition-[width] duration-300`
    },

    file: `flex flex-col gap-2 mt-2`,

    basicContent: { root: `flex items-center gap-2` },

    empty: `flex flex-col items-center justify-center gap-2 py-8
        text-stone-400 `,
});
</script>
