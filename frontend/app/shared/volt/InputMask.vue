<template>
    <InputMask
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import InputMask, { type InputMaskPassThroughOptions, type InputMaskProps } from 'primevue/inputmask';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ InputMaskProps {}
defineProps<Props>();

// Mirrors VoltInputText's theme so masked fields (e.g. phone) are visually
// identical to plain text inputs across the storefront forms.
const theme = ref<InputMaskPassThroughOptions>({
    root: `appearance-none w-full rounded-lg outline-none
        border-[1.5px] border-line
        min-h-(--control-h) px-3.5 py-2
        bg-surface
        text-sm font-normal text-ink text-ellipsis
        placeholder:text-subtle
        enabled:hover:border-subtle/40
        enabled:focus:border-brand-500
        enabled:focus:ring-[3px] enabled:focus:ring-brand-500/10
        autofill:shadow-[inset_0_0_0_1000px_var(--color-brand-50)]
        autofill:[-webkit-text-fill-color:var(--color-ink)]
        autofill:border-brand-500/40
        autofill:caret-ink
        disabled:pointer-events-none disabled:opacity-50
        [&.p-invalid]:border-error [&.p-invalid]:bg-error/[0.03]
        p-small:px-3 p-small:py-2 p-small:text-xs
        p-large:px-5 p-large:py-3.5 p-large:text-base
        transition duration-150`
});
</script>
