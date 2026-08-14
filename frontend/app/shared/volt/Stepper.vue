<template>
  <Stepper
    v-model:value="model"
    unstyled
    linear
    :pt="{ root: 'flex flex-col gap-5 h-full overflow-hidden' }"
    :ptOptions="{ mergeProps: ptViewMerge }"
  >
    <StepList
      unstyled
      :pt="{ root: 'flex items-center gap-1 flex-nowrap pb-4 border-b border-stone-100' }"
      :ptOptions="{ mergeProps: ptViewMerge }"
    >
      <template
        v-for="(step, i) in steps"
        :key="step.value"
      >
        <Step
          :value="step.value"
          unstyled
          as-child
          :ptOptions="{ mergeProps: ptViewMerge }"
        >
          <template #default="{ active }">
            <component
              :is="isPast(step.value) ? 'button' : 'div'"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
              :class="active
                ? brandClass
                : isPast(step.value)
                  ? 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700 cursor-pointer'
                  : 'text-stone-300'"
              @click="isPast(step.value) ? model = step.value : undefined"
            >
              <Icon
                v-if="isPast(step.value)"
                name="ri:check-line"
                class="w-3.5 h-3.5 shrink-0"
              />
              <span
                v-else
                class="tabular-nums"
              >{{ i + 1 }}</span>
              <span>{{ step.label }}</span>
            </component>
          </template>
        </Step>
        <Icon
          v-if="i < steps.length - 1"
          name="ri:arrow-right-s-line"
          class="w-3 h-3 shrink-0 text-stone-300"
        />
      </template>
    </StepList>

    <StepPanels
      unstyled
      :pt="{ root: 'flex-1 overflow-y-auto px-0.5' }"
      :ptOptions="{ mergeProps: ptViewMerge }"
    >
      <slot />
    </StepPanels>
  </Stepper>
</template>

<script setup lang="ts">
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import Step from 'primevue/step'
import StepPanels from 'primevue/steppanels'
import { ptViewMerge, brandClass  } from './utils'

interface StepItem {
  value: number | string
  label: string
}

const model = defineModel<number | string>()

// The template reads `steps` directly (script-setup exposes props by name), so the
// binding itself is unused.
defineProps<{ steps: StepItem[] }>()

const isPast = (value: number | string) => {
  if (model.value === undefined || model.value === null) return false
  return Number(value) < Number(model.value)
}
</script>
