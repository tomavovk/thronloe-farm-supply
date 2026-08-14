<template>
    <Inplace
        v-bind="inplaceProps"
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
        @update:active="$emit('update:active', $event)"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Inplace>
</template>

<script setup lang="ts">
import Inplace, { type InplacePassThroughOptions, type InplaceProps } from 'primevue/inplace';
import { computed } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ InplaceProps {
    fluid?: boolean
}

const props = defineProps<Props>();
defineEmits<{ 'update:active': [value: boolean] }>();

const inplaceProps = computed(() => {
    const { fluid: _fluid, ...rest } = props;
    return rest;
});

const theme = computed<InplacePassThroughOptions>(() => ({
    root: props.fluid ? 'block w-full' : 'inline-block',

    display: [
        'cursor-pointer inline-flex items-center gap-1.5',
        'px-2 py-1 -mx-2 -my-1 rounded-xl',
        'text-sm text-stone-900',
        'hover:bg-stone-100',
        'transition-colors duration-150',
        'p-disabled:opacity-50 p-disabled:pointer-events-none',
        props.fluid ? 'w-[calc(100%+1rem)]' : '',
    ].join(' '),

    content: props.fluid ? 'block w-full' : 'inline-flex items-center gap-2'
}));
</script>
