<template>
    <Menu
        ref="el"
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Menu>
</template>

<script setup lang="ts">
import Menu, { type MenuPassThroughOptions, type MenuProps } from 'primevue/menu';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ MenuProps {}
defineProps<Props>();

const theme = ref<MenuPassThroughOptions>({
    root: `bg-white
        text-stone-900
        border border-stone-200
        rounded-xl min-w-44
        p-popup:shadow-lg p-popup:shadow-stone-200/80 `,
    list: `m-0 p-1.5 list-none outline-none flex flex-col gap-0.5`,
    item: `p-disabled:opacity-50 p-disabled:pointer-events-none`,
    itemContent: `group transition-colors duration-150 rounded-xl text-stone-700
        p-focus:bg-stone-100 p-focus:text-stone-900
        hover:bg-stone-100 hover:text-stone-900 `,
    itemLink: `cursor-pointer flex items-center no-underline overflow-hidden relative text-inherit
        px-2 py-1.5 gap-2.5 select-none outline-none text-sm`,
    itemIcon: `w-4 h-4 text-stone-400 shrink-0
        p-focus:text-stone-500
        group-hover:text-stone-500 `,
    itemLabel: ``,
    submenuLabel: `bg-transparent px-2 pt-2 pb-1 text-xs font-semibold text-stone-400 uppercase tracking-widest`,
    separator: `border-t border-stone-100 my-1`,
    transition: {
        enterFromClass: 'opacity-0 scale-y-75',
        enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
        leaveActiveClass: 'transition-opacity duration-100 ease-linear',
        leaveToClass: 'opacity-0'
    }
});

const el = ref();
defineExpose({
    toggle: (event: Event) => el.value.toggle(event)
});
</script>
