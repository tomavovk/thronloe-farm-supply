<template>
    <ContextMenu
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
    </ContextMenu>
</template>

<script setup lang="ts">
import ContextMenu, { type ContextMenuPassThroughOptions, type ContextMenuProps } from 'primevue/contextmenu';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ ContextMenuProps {}
defineProps<Props>();

const theme = ref<ContextMenuPassThroughOptions>({
    root: `bg-white
        text-stone-900
        border border-stone-200
        rounded-xl min-w-52 shadow-md z-50`,

    rootList: `m-0 p-1 list-none outline-none flex flex-col gap-0.5`,

    item: `p-disabled:opacity-50 p-disabled:pointer-events-none`,

    itemContent: `group transition-colors duration-150 rounded-lg
        text-stone-900
        p-focus:bg-stone-100
        hover:bg-stone-100 `,

    itemLink: `cursor-pointer flex items-center no-underline overflow-hidden relative text-inherit
        px-3 py-2 gap-2 select-none outline-none text-sm`,

    itemIcon: `w-4 h-4 text-stone-500
        p-focus:text-stone-600
        group-hover:text-stone-600 `,

    itemLabel: `flex-1`,

    submenuIcon: `w-4 h-4 ms-auto text-stone-400 `,

    submenu: `bg-white
        border border-stone-200
        rounded-xl min-w-52 shadow-md
        p-1 list-none m-0 flex flex-col gap-0.5`,

    separator: `border-t border-stone-200 my-1`,

    transition: {
        enterFromClass: 'opacity-0 scale-95',
        enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
        leaveActiveClass: 'transition-opacity duration-100 ease-linear',
        leaveToClass: 'opacity-0'
    }
});

const el = ref();
defineExpose({
    show: (event: MouseEvent) => el.value?.show(event),
    hide: () => el.value?.hide()
});
</script>
