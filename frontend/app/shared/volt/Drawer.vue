<template>
  <Drawer
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template #closebutton="{ closeCallback }">
      <SecondaryButton
        aria-label="Close"
        @click="closeCallback"
      >
        <template #icon>
          <UiGlyph name="close" />
        </template>
      </SecondaryButton>
    </template>
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}"
      />
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import Drawer, { type DrawerPassThroughOptions, type DrawerProps } from 'primevue/drawer'
import { ref } from 'vue'
import SecondaryButton from './SecondaryButton.vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ DrawerProps {}
defineProps<Props>()

// Bottom position is the design's filters sheet (`.filters-sheet` below lg):
// content-sized up to 85dvh — NOT the fixed `h-40` a stock Volt drawer uses — with
// the design's upward shadow and its 50%-ink mask.
const theme = ref<DrawerPassThroughOptions>({
  root: `flex flex-col pointer-events-auto relative
        border-line
        bg-surface
        text-ink
        p-left:w-80 p-left:h-full p-left:border-e
        p-right:w-80 p-right:h-full p-right:border-s
        p-top:h-auto p-top:max-h-[85dvh] p-top:w-full p-top:border-b
        p-bottom:h-auto p-bottom:max-h-[85dvh] p-bottom:w-full p-bottom:border-t
        p-bottom:shadow-[0_-16px_30px_-16px_rgba(24,20,18,.4)]
        p-full-screen:transition-opacity p-full-screen:transform-none p-full-screen:w-screen
        p-full-screen:h-screen p-full-screen:max-h-full p-full-screen:top-0 p-full-screen:left-0`,

  header: `flex items-center justify-between gap-3 flex-shrink-0 border-b border-line p-4`,
  title: `text-lg font-semibold`,
  content: `overflow-y-auto overscroll-contain flex-1 min-h-0 p-4`,
  footer: `shrink-0 flex w-full gap-3 border-t border-line p-4`,
  mask: `p-modal:bg-[rgba(24,20,18,.5)]`,

  transition: {
    enterFromClass: `p-left:-translate-x-full p-right:translate-x-full p-top:-translate-y-full p-bottom:translate-y-full p-full-screen:opacity-0`,
    enterActiveClass: `transition-transform duration-300 ease-out p-full-screen:transition-opacity`,
    leaveActiveClass: `transition-transform duration-200 ease-in p-full-screen:transition-opacity`,
    leaveToClass: `p-left:-translate-x-full p-right:translate-x-full p-top:-translate-y-full p-bottom:translate-y-full p-full-screen:opacity-0`,
  },
})
</script>
