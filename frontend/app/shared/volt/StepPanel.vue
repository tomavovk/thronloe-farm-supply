<template>
  <StepPanel
    :value="value"
    unstyled
    :pt="{ root: 'flex flex-col h-full' }"
    :ptOptions="{ mergeProps: ptViewMerge }"
  >
    <div class="flex flex-col gap-4 flex-1">
      <slot />
    </div>
  </StepPanel>
</template>

<script setup lang="ts">
import StepPanel from 'primevue/steppanel'
import { ptViewMerge } from './utils'

defineProps<{ value: number | string }>()
</script>
