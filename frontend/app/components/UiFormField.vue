<template>
  <div :class="['flex min-w-0 flex-col gap-1.5', full && 'sm:col-span-2']">
    <label
      :for="inputId"
      class="text-sm font-semibold"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-badge"
      >
        *
      </span>
    </label>

    <slot :input-id="inputId" />

    <small
      v-if="error"
      class="text-badge text-xs font-medium"
    >
      {{ error }}
    </small>
  </div>
</template>

<script setup lang="ts">
// Design `.co-field`: label above the control, red asterisk when required, and the
// validation message below (`.auth-err`). Used by every form in the app.
withDefaults(
  defineProps<{
    label: string
    /** Bound to the control through the default slot's `inputId`. */
    inputId: string
    required?: boolean
    error?: string
    /** Span both columns of the two-column grid (design `.co-field.full`). */
    full?: boolean
  }>(),
  { required: false, full: false },
)

defineSlots<{ default: (props: { inputId: string }) => unknown }>()
</script>
