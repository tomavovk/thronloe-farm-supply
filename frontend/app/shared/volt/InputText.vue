<template>
  <InputText
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  />
</template>

<script setup lang="ts">
import InputText, { type InputTextPassThroughOptions, type InputTextProps } from 'primevue/inputtext'
import { computed } from 'vue'
import { ptViewMerge } from './utils'

// `autocomplete` is omitted deliberately. InputTextProps extends Vue's
// InputHTMLAttributes, whose `autocomplete` is the combinatorial `AutoFill`
// template-literal union (section × address-kind × field × credential) — resolving
// it through defineProps blows past TS's union limit ("expression produces a union
// type that is too complex to represent"). It still reaches the <input> as a
// fallthrough attribute, so only the wrapper's own typing for it is lost.
interface Props extends /* @vue-ignore */ Omit<InputTextProps, 'autocomplete'> {
  /**
   * Frameless field for the design's composite rows — the header search, the
   * mobile-menu search and the newsletter form all draw the border on the
   * surrounding flex row and keep the input itself bare.
   *
   * A real prop, not classes from the call site: `border-none bg-transparent`
   * passed as a fallthrough class is not twMerged against the PT's own
   * `border border-line`, so which one wins is down to CSS source order.
   */
  bare?: boolean
}

const { bare = false } = defineProps<Props>()

// Design fields (`.newsletter-form input`, `.search-field input`): 1px line
// border, surface background, small text, square, and a 2px brand focus outline
// drawn inside the box.
const BARE_CLASS: string = `w-full min-w-0 appearance-none border-none bg-transparent p-0 outline-none
        text-ink placeholder:text-subtle
        disabled:pointer-events-none disabled:opacity-50`

const FRAMED_CLASS: string = `appearance-none w-full outline-none
        border border-line
        px-3 py-[0.7rem]
        bg-surface
        text-sm font-normal text-ink text-ellipsis
        placeholder:text-subtle
        enabled:hover:border-brand
        enabled:focus:outline-2 enabled:focus:outline-brand enabled:focus:-outline-offset-1
        autofill:shadow-[inset_0_0_0_1000px_var(--color-brand-50)]
        autofill:[-webkit-text-fill-color:var(--color-ink)]
        autofill:caret-ink
        disabled:pointer-events-none disabled:opacity-50
        [&.p-invalid]:border-error
        p-small:px-3 p-small:py-2 p-small:text-xs
        p-large:px-4 p-large:py-3 p-large:text-base
        transition-colors duration-[350ms]`

const rootClass = computed(() => (bare ? BARE_CLASS : FRAMED_CLASS))

const theme = computed<InputTextPassThroughOptions>(() => ({ root: rootClass.value }))
</script>
