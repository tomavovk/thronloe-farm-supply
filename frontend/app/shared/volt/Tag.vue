<template>
    <Tag
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-if="props.dot || props.dotColor || props.iconName" #icon>
            <span
                v-if="props.dot || props.dotColor"
                :class="['w-1.5 h-1.5 rounded-full shrink-0', !props.dotColor && typeof props.dot === 'string' ? props.dot : (!props.dotColor ? 'bg-current' : '')]"
                :style="props.dotColor ? { background: props.dotColor } : undefined"
            />
            <Icon
                v-else-if="props.iconName"
                :name="props.iconName"
                class="w-3 h-3 shrink-0"
                :style="props.iconColor ? { color: props.iconColor } : undefined"
            />
        </template>
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Tag>
</template>

<script setup lang="ts">
import Tag, { type TagPassThroughOptions, type TagProps } from 'primevue/tag';
import { computed } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ TagProps {
  dot?: boolean | string
  dotColor?: string
  iconName?: string
  iconColor?: string
  borderClass?: string
  textClass?: string
  bgClass?: string
}
const props = defineProps<Props>();

const theme = computed<TagPassThroughOptions>(() => ({
    root: [
        'inline-flex items-center justify-center text-xs font-medium px-2 py-0.5 rounded-full gap-1',
        'border',
        props.textClass || 'text-stone-700',
        props.borderClass || 'border-stone-300',
        props.bgClass || '',
        ...(props.textClass ? [] : [
            'p-success:text-emerald-600',
            'p-info:text-sky-600',
            'p-warn:text-amber-600',
            'p-danger:text-red-500',
            'p-secondary:text-stone-500',
            'p-contrast:text-violet-600',
        ]),
        ...(props.borderClass ? [] : [
            'p-success:border-emerald-600',
            'p-info:border-sky-600',
            'p-warn:border-amber-600',
            'p-danger:border-red-500',
            'p-secondary:border-stone-400',
            'p-contrast:border-violet-600',
        ]),
    ].join(' '),
    icon: 'w-3 h-3',
}));
</script>
