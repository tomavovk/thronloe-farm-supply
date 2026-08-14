<template>
  <Dialog
    unstyled
    dismissable-mask
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template #closebutton="{ closeCallback }">
      <SecondaryButton
        variant="text"
        rounded
        autofocus
        @click="closeCallback"
      >
        <template #icon>
          <Icon
            name="ri:close-line"
            class="w-4 h-4"
          />
        </template>
      </SecondaryButton>
    </template>
    <template #maximizebutton="{ maximized, maximizeCallback }">
      <SecondaryButton
        variant="text"
        rounded
        autofocus
        @click="maximizeCallback"
      >
        <template #icon>
          <Icon
            :name="maximized ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-line'"
            class="w-4 h-4"
          />
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
  </Dialog>
</template>

<script setup lang="ts">
import Dialog, { type DialogPassThroughOptions, type DialogProps } from 'primevue/dialog'
import { ref } from 'vue'
import SecondaryButton from './SecondaryButton.vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ DialogProps {}
defineProps<Props>()

const theme = ref<DialogPassThroughOptions>({
  root: `max-h-[90%] w-135 max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden
        border border-stone-300
        bg-white
        text-stone-900 shadow-xl
        p-maximized:w-screen p-maximized:h-screen p-maximized:top-0 p-maximized:start-0 p-maximized:max-h-full p-maximized:rounded-none`,
  header: `flex items-center justify-between shrink-0 h-12.5 px-5 pt-5
        rounded-t-xl`,
  title: `font-semibold text-lg`,
  headerActions: `flex items-center gap-2`,
  content: `overflow-y-auto px-5 pt-5 pb-5 p-maximized:grow`,
  footer: `shrink-0 px-5 pt-4 pb-4 flex w-full gap-2`,
  mask: `p-modal:bg-black/40 p-modal:backdrop-blur-sm p-modal:fixed p-modal:top-0 p-modal:start-0 p-modal:w-full p-modal:h-full`,
  transition: {
    enterFromClass: 'opacity-0 scale-75',
    enterActiveClass: 'transition-all duration-150 ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
    leaveToClass: 'opacity-0 scale-75',
  },
})
</script>
