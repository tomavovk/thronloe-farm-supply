<template>
  <Badge
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}"
      />
    </template>
  </Badge>
</template>

<script setup lang="ts">
import Badge, { type BadgePassThroughOptions, type BadgeProps } from 'primevue/badge'
import { ref } from 'vue'
import { ptViewMerge, brandClass  } from './utils'

interface Props extends /* @vue-ignore */ BadgeProps {}
defineProps<Props>()

const theme = ref<BadgePassThroughOptions>({
  root: `inline-flex items-center justify-center rounded-full leading-none
        min-w-4.5 h-4.5 px-1 text-xs font-semibold
        ${brandClass}
        p-secondary:bg-panel p-secondary:text-muted
        p-success:bg-success p-success:text-white
        p-info:bg-sky-500 p-info:text-white
        p-warn:bg-yellow-500 p-warn:text-white
        p-danger:bg-error p-danger:text-white
        p-small:min-w-3.5 p-small:h-3.5 p-small:text-xs
        p-large:min-w-6 p-large:h-6 p-large:text-xs`,
})
</script>
