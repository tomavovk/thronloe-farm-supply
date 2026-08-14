# Editing Volt components

These files are the project's only styling layer — PrimeVue runs `unstyled: true`,
so every visual decision lives in the `theme` object here. Edit them directly when
a component needs a new variant or prop; never build a wrapper or a parallel
implementation outside. (`UiButton` and `UiPagination` were exactly that mistake,
and both are gone: the design's `.btn` looks are now `Button.vue`'s severities and
the pager is `Paginator.vue`'s container slot.)

Adapted from the countryside-concrete kit, plus the landmines found while porting
this design. Add to it in the same commit as the fix.

## The wrapper pattern

Each file declares `interface Props extends /* @vue-ignore */ XProps {}` with a
bare `defineProps<Props>()`, so **no props are declared at runtime** — everything
falls through via `$attrs` onto the root PrimeVue component. Two consequences:

- A `class` passed from outside lands on the root as a same-layer utility next to
  the PT's own classes; it does **not** go through `twMerge`, so it can silently
  lose to them. Base-level `hidden` vs the PT's `inline-flex` is the classic case,
  and `text-base` vs the PT's `text-sm` is the one that bit here. **Sizing and
  display belong in a prop or on a wrapper element, not in a fallthrough class.**
- A `:pt` passed from outside overwrites `:pt="theme"` and blanks the component.
  Do not "support" it — the fix for a missing capability is a real prop here.

## Adding a prop

Add it to `interface Props`, capture it (`const props = defineProps<Props>()`),
and fold it into the theme (make `theme` a `computed`). `Button.vue`'s `size`,
`to` and `href` are the reference: `size` exists because callers were passing
padding classes that the PT could out-order, `to`/`href` because every call site
otherwise repeated `:as="NuxtLink"` boilerplate.

## State variants: check the attribute before you write the selector

PrimeVue 4 exposes state in two different shapes, and only one of them works with
tailwindcss-primeui's `p-*` variants (which match `[data-p~="…"]`):

| What | Attribute | Write |
| --- | --- | --- |
| Checkbox checked, Select focused/open, ToggleButton checked | `data-p="checked"` / `"focus"` | `p-checked:` / `p-focus:` — fine |
| Button severity | `data-p-severity="secondary"`, `data-p=""` | `data-[p-severity=secondary]:` |
| Galleria active thumbnail | `data-p-active="true"` | `data-[p-active=true]:` |

`p-secondary:` and `p-active-item:` look right and style nothing. When adding a
variant, open the DOM and read the real attribute first.

## Inline styles from props beat the PT (and your classes)

`Skeleton`'s `width`/`height` props land as an inline `style`, so nothing in a class
can win against them. `height="0"` with `aspect-[6/5]` renders a zero-height box:
`aspect-ratio` only derives a height while height is `auto`. Give the aspect ratio to
a wrapper `<div>` and pass `height="100%"`. Same reasoning applies to any PrimeVue prop
that maps to a style — check the rendered element before styling around it.

## Hidden accessible inputs

Unstyled PrimeVue form controls render a hidden `<input>`. Two independent rules:

1. **The root PT must include `relative`.** Tailwind's `.sr-only` is
   `position: absolute`; with no positioned ancestor its containing block becomes
   the document, so the input joins the page's scrollable overflow and inflates
   `scrollHeight` — a phantom gap at the bottom of a scroll area that disappears
   on any reflow (so it only shows on fresh load).
2. **`sr-only` is wrong when the control is clicked directly.** PrimeVue binds
   `onChange` to the input, not the root, so a 1px input means clicks do nothing.
   Checkbox and RadioButton keep `sr-only` **because they are used inside a
   wrapping `<label>`** — which is also what the design's filter rows do. A
   sibling `<label for>` leaves the 15px box itself dead; don't "fix" it that way.
   A ToggleSwitch-style control needs `absolute inset-0 w-full h-full m-0
   opacity-0 z-10` instead.

## Some components' root is not the element you think

PrimeVue renders Galleria as `GalleriaContent`, so `data-pc-name="galleria"`
never appears and a fallthrough `class` (a grid `col-span`, say) reaches nothing —
the gallery collapsed to 95px wide until the layout class moved to a wrapper
`<div>`. When a layout class seems to be ignored, print the ancestor chain and
check which element actually carries the PT root.

Section names can also differ from the obvious guess: Galleria's navigators are
`prevButton`/`nextButton`, not `itemPrevButton`. Probe
`[data-pc-section]` before theming.

## Icons

Icons are already ported (Streamline Sharp via `<SlIcon>`, the design's hand-drawn
glyphs via `<UiGlyph>`); Volt files use those, never `ri:` — the Remix Icon set
isn't installed here, so a leftover `ri:` name renders an empty `<svg>`.

When sizing an `<Icon>` directly, use `w-4! h-4!`: `@nuxt/icon` injects an
unlayered `:where(.iconify) { width: 1em }` rule, and unlayered author
declarations beat Tailwind's layered utilities.

## Overlays close when an ancestor scrolls — by design

PrimeVue attaches a scroll handler on show that hides the overlay when any
scrollable ancestor scrolls. There is no `hideOnScroll` prop. `overscroll-contain`
on Select's `listContainer` keeps touch gestures inside the panel; for a long list
on a phone, prefer a bottom `VoltDrawer` over fighting the handler.

## Colors

Only the semantic tokens from `assets/css/theme.css` (`brand`, `brand-hover`,
`ink`, `muted`, `subtle`, `line`, `surface`, `panel`, `badge`, `error`,
`success`). The numbered `brand-50…950` stops exist **only** for Volt internals
that were written against a scale. No PrimeVue design tokens
(`var(--p-primary-500)`), no `definePreset`, no `@primeuix/themes`, and no `dark:`
variants — this storefront is light-only.
