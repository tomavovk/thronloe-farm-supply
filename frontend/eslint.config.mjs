// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    name: 'thornloe/ignores',
    ignores: ['public/**', '.output/**', 'design/**'],
  },

  {
    // app/shared/volt/** is vendored from PrimeVue's Volt. It ships camelCase
    // pass-through attributes (`:ptOptions`), `interface Props extends XProps {}`
    // for prop forwarding and `any` in its merge helper — all upstream authoring
    // choices. Linting them to our rules would mean rewriting ~40 files we want
    // to keep diffable against upstream, so those specific rules are relaxed here
    // (and only here). Everything else still applies.
    name: 'thornloe/vendored-volt',
    files: ['app/shared/volt/**/*.{vue,ts}'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/html-self-closing': 'off',
      'vue/require-default-prop': 'off',
      'vue/v-slot-style': 'off',
    },
  },

  {
    // Optional props with no default are idiomatic in this codebase: components
    // branch on `undefined` (a missing `to` means "render a <button>", a missing
    // subtitle means "no subtitle line"), and inventing defaults to satisfy the
    // rule would add meaningless `undefined` literals.
    name: 'thornloe/app',
    files: ['app/**/*.vue'],
    rules: {
      'vue/require-default-prop': 'off',

      // Formatting, and Prettier already decides it (it writes `<br />`, this rule
      // wants `<br>`). Leaving both on means every fix by one re-breaks the other.
      'vue/html-self-closing': 'off',
    },
  },
)
