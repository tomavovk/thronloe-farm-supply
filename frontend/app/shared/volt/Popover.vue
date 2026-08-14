<template>
  <Popover
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
  </Popover>
</template>

<script setup lang="ts">
import Popover, { type PopoverPassThroughOptions, type PopoverProps } from 'primevue/popover';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ PopoverProps {}
defineProps<Props>();

const theme = ref<PopoverPassThroughOptions>({
    root: `mt-2 p-flipped:-mt-2 p-flipped:mb-2
        bg-white text-stone-900
        border border-stone-200
        rounded-xl shadow-lg shadow-stone-200/80 `,
    content: `p-2`,
    transition: {
        enterFromClass: 'opacity-0 scale-y-75',
        enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
        leaveActiveClass: 'transition-opacity duration-100 ease-linear',
        leaveToClass: 'opacity-0'
    }
});

const el = ref();
defineExpose({
    toggle: (event: MouseEvent, target?: HTMLElement) => el.value.toggle(event, target),
    show: (event: MouseEvent, target?: HTMLElement) => el.value.show(event, target),
    hide: () => el.value.hide()
});
</script>
