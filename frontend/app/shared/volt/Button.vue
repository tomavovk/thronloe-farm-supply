<template>
  <Button
    unstyled
    :as="resolvedAs"
    v-bind="linkAttrs"
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
  </Button>
</template>

<script setup lang="ts">
import Button, { type ButtonPassThroughOptions, type ButtonProps } from 'primevue/button'
import { computed, resolveComponent } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ ButtonProps {
  /**
   * Padding/type scale of the design's `.btn`. Real props rather than classes
   * passed from the outside: a fallthrough `class` is not run through twMerge
   * against the PT, so `text-base` vs the PT's `text-sm` would be decided by CSS
   * source order instead of by the caller.
   *   sm → `.product-card .btn` / `.cat-panel-all` (0.55rem 1.1rem)
   *   md → `.btn` (0.8rem 1.5rem)
   *   lg → `.m-account` (0.9rem 1.5rem, larger text)
   */
  size?: 'sm' | 'md' | 'lg'
  /** Render as a NuxtLink to this route. */
  to?: string | Record<string, unknown>
  /** Render as a plain anchor (tel:, mailto:, external). */
  href?: string
}

const props = withDefaults(defineProps<Props>(), { size: 'md' })

const resolvedAs = computed(() => {
  if (props.to) {
    return resolveComponent('NuxtLink')
  }

  if (props.href) {
    return 'a'
  }

  return undefined
})

const linkAttrs = computed(() => {
  if (props.to) {
    return { to: props.to }
  }

  if (props.href) {
    return { href: props.href }
  }

  return {}
})

const SIZES = {
  sm: 'px-[1.1rem] py-[0.55rem] text-sm',
  md: 'px-6 py-[0.8rem] text-sm',
  lg: 'px-6 py-[0.9rem] text-base',
} as const

// The design's `.btn` family (single inline <style>, lines 318–327), mapped onto
// PrimeVue severities so one component covers all three looks:
//   default            → .btn-primary  (three-stop gradient that slides on hover)
//   severity=secondary → .btn-ghost    (line border, brand on hover)
//   severity=contrast  → .cta-btn      (surface on the gradient banner)
//
// Severity is targeted through `data-[p-severity=…]` rather than tailwindcss-primeui's
// `p-secondary:` variant: PrimeVue 4 puts the severity in its own `data-p-severity`
// attribute and leaves `data-p` empty, so the plugin's variant never matches
// (verified in the DOM). State variants like `p-checked:`/`p-focus:` DO land in
// `data-p` and are used as-is elsewhere.
const theme = computed<ButtonPassThroughOptions>(() => ({
  root: `relative inline-flex cursor-pointer select-none items-center justify-center gap-2
        overflow-hidden whitespace-nowrap
        ${SIZES[props.size]} font-semibold
        border border-transparent
        text-white bg-[image:var(--grad-btn)] bg-[length:220%_100%] bg-[position:0%_0]
        enabled:hover:bg-[position:100%_0]

        data-[p-severity=secondary]:bg-none data-[p-severity=secondary]:bg-surface
        data-[p-severity=secondary]:text-ink data-[p-severity=secondary]:border-line
        enabled:hover:data-[p-severity=secondary]:border-brand
        enabled:hover:data-[p-severity=secondary]:text-brand

        data-[p-severity=contrast]:bg-none data-[p-severity=contrast]:bg-surface
        data-[p-severity=contrast]:text-ink
        enabled:hover:data-[p-severity=contrast]:bg-panel
        enabled:hover:data-[p-severity=contrast]:text-ink

        disabled:pointer-events-none disabled:opacity-45
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
        transition-[background-position,background-color,color,border-color] duration-[350ms]`,

  label: ``,
  icon: `shrink-0`,
  loadingIcon: `shrink-0 animate-spin`,
}))
</script>
