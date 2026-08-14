# Thornloe Farm Supply — storefront

Nuxt 4 port of the static design at `design/thornloe-farm-supply.html`. Conventions
are shared with the NCS storefront (same house style); design-specific rules below
are Thornloe's own.

> **It's a catalogue, not a store.** Cart, checkout and payments were deliberately
> removed from the design (commit `014375c` in the design history): a PDP shows the
> price plus a "Contact us" action, and the account area keeps order history only.
> Don't reintroduce cart/checkout concepts.

## Environment & Tech Stack

- **Node.js:** v22 via `fnm` — always run `eval "$(fnm env)" && fnm use 22` before any `node`, `npm`, or `nuxt` command
- **Framework:** Nuxt 4 (Vue 3, Composition API, `<script setup>`, `app/` srcDir)
- **Language:** TypeScript (strict)
- **UI Components:** PrimeVue 4 (unstyled) + Volt components in `app/shared/volt/`
- **Styling:** Tailwind CSS v4 + `tailwindcss-primeui`, `tailwind-merge`
- **Icons:** Streamline Sharp via `<Icon name="streamline-sharp:..." />` — the design's own set, see **Icons** below
- **Fonts:** Instrument Sans (self-hosted, `@fontsource-variable/instrument-sans`)
- **Forms:** VeeValidate + Zod (`vee-validate`, `@vee-validate/zod`, `zod`)
- **Auth:** `@sidebase/nuxt-auth` v1.x — `local` provider, configured but dormant: the app runs its own
  `useSession`/`useApi` against the mock. Kept for when the real backend lands; don't remove it.

### Checks

Four gates, all green, and CI (`.github/workflows/ci.yml`) runs every one on push and PR:

| Command                           | Owns                                            |
| --------------------------------- | ----------------------------------------------- |
| `npm run lint` / `lint:fix`       | correctness + the Vue/TS rules (`@nuxt/eslint`) |
| `npm run format` / `format:check` | formatting, all of it (Prettier)                |
| `npm run typecheck`               | types — **0 errors, keep it that way**          |
| `npm test`                        | 55 unit tests                                   |

The two linters have strictly separate jobs: ESLint runs with `stylistic: false` and its
formatting-adjacent rules switched off, because every one of them fights Prettier
(`arrow-parens` wants `x => x` where Prettier writes `(x) => x`; `vue/html-self-closing`
wants `<br>` where Prettier writes `<br />`) and each "fix" re-breaks the other. Add
formatting opinions to `.prettierrc`, never to ESLint.

`app/shared/volt/**` is exempt from both (vendored, upstream style) — see
`app/shared/volt/CLAUDE.md`.

**`.prettierrc` keeps `htmlWhitespaceSensitivity: "css"`.** With `"ignore"` Prettier
breaks inline content across lines freely, which _changes rendered text_: it turned
`<a>{{ phone }}</a>.` into a line break before the period, rendering "(705) 563-2555 .".

## Code Conventions

- **Functions:** always arrow functions — `const foo = () => {}`, never `function foo() {}`
- **`if` blocks:** always add a blank line before and after every `if` block
- **Constants:** any value used in 2+ places must be extracted to a single source of truth — export from a composable if related to it, otherwise place in `shared/constants/`

```ts
// shared/constants/priorities.ts
export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const

export type Priority = (typeof PRIORITIES)[number]['value']
```

### Single-file component block order

```vue
<template>
  <!-- markup -->
</template>

<script setup lang="ts">
// logic
</script>

<style scoped>
/* Rare — prefer Tailwind utilities. Only when a utility genuinely can't express it. */
</style>
```

`<template>` first, then `<script setup>`, then `<style>` (if any).

### `<script setup>` block order

```ts
// 1. Props, emits, model
const props = defineProps<...>()
const emit  = defineEmits<...>()
const value = defineModel<...>()

// 2. Composables
const router = useRouter()
const api    = useApi()

// 3. Reactive state
const loading = ref(false)

// 4. Computed
const isValid = computed(() => ...)

// 5. Methods & handlers
const onSubmit = async () => { ... }

// 6. Watchers
watch(value, () => { ... })

// 7. Lifecycle hooks
onMounted(() => { ... })
```

Never scatter composables across the file — group all `useX()` calls at the top, right after props/emits.

## Refactoring

When asked to "refactor" (with no other detail), apply **SOLID, DRY, KISS** within
this stack.

- **SRP / SOLID.** One unit, one job. Split **presentational components**
  (props in, `emit` out, no fetching/business logic) from **stateful logic**
  (composables in `shared/composables/` or the feature's own `composables/`).
- **DRY.** A repeated template block → a component; repeated logic → a composable
  or `shared/utils/` helper; a repeated literal → `shared/constants/`. Always check
  `shared/composables/`, `shared/utils/`, `shared/constants/` before adding.
- **KISS.** Simplest thing that works. No premature abstraction. Extract **only** on
  real reuse or when a file clearly does too much. Inline a one-off.

### Vue / Nuxt specifics

- **`computed` over `watch` for derived state.** Watchers are for side-effects only.
- **Props down, events up.** Never mutate a prop; use `defineModel()` for v-model.
- **Don't destructure `reactive()` or `props`** — it drops reactivity.
- **Composables vs utils.** Stateful/reactive logic → `composables/` (`useX`, returns
  refs/computed); pure stateless helpers → `shared/utils/`.
- **Composable hygiene.** Clean up side-effects (`onScopeDispose` / `onUnmounted`);
  expose `readonly()` state callers shouldn't mutate.
- **Module-scoped state = a global singleton.** Only when sharing is intentional.
- Also: slots over boolean-prop sprawl; lift complex template expressions into
  `computed`; stable `:key` in `v-for` (not index); `defineAsyncComponent` for
  heavy/rare components; no `any` (narrow `unknown`).

Refactors **must not change behavior**. After one, run `npm run typecheck` and
`npm test`, and keep the diff reviewable.

## Components & Styling

PrimeVue runs in `unstyled: true` mode. All styling comes from Volt components via Tailwind classes.

**Before writing any raw HTML element** (`<table>`, `<input>`, `<textarea>`, `<dialog>`, etc.) — check `app/shared/volt/` first. If a Volt component exists, use it.

**ALWAYS:**

- Use Volt components (`VoltButton`, `VoltInputText`, `VoltDialog`, `VoltSelect`, `VoltTag`, …) — auto-imported globally
- Use Tailwind classes for all styling
- Edit Volt files directly in `app/shared/volt/` when customization is needed
- Use the `#icon` slot with `<Icon>` on VoltButton — never the `icon="pi pi-*"` prop

**Everything that can be a Volt component is one** — including the controls the
design hand-draws natively (`<select>`, checkboxes, search inputs, the `.btn`
family, the FAQ accordion). The wrapper carries the design's look; the design
simply had no component library. If a needed Volt component is missing from
`app/shared/volt/`, add it from upstream Volt and style it to the design rather
than writing the control by hand.

The one exception is icons: they come from the design's Streamline set through
`<SlIcon>` / `<UiGlyph>`, not from a component library — see **Icons**.

Carousels stay as the design's scroll-snap tracks (a deliberate call, not an
oversight): `useCarousel` + `UiCarouselNav` / `UiCarouselProgress`.

**NEVER:**

- Import from `primevue/*` directly for UI components
- Use `definePreset`, `Aura`, `Lara`, or any `@primeuix/themes`
- Use PrimeVue design tokens (`var(--p-primary-500)`) or CSS variables
- Import from `@primevue/icons/*`

### Design tokens

Tokens live in `app/assets/css/theme.css`, ported 1:1 from the design's `:root` block
(the mapping table is in that file). Notes that bite:

- The design is **fully square** — Tailwind's whole radius scale is zeroed, so Volt's
  `rounded-md`/`rounded-lg` render sharp. Don't add radii back.
- `text-xl` and up are **larger** than Tailwind's defaults (xl = 1.375rem, 2xl = 1.75,
  3xl = 2.25, 4xl = 3). Spacing matches Tailwind 1:1, so `--space-4` = `p-4`.
- The page container is **full-width** (`--maxw: none`): use the `container-page`
  utility, which applies the design's responsive gutter (1rem → 60px at lg).
- Brand gradients (`--grad-accent`, `--grad-btn`) are plain CSS vars — Tailwind has no
  gradient token and both recur across sections.

### Icons

The design draws every icon from **Streamline Sharp** (Iconify `streamline-sharp`,
CC BY 4.0), rendered at **1.35× stroke width**. Reproduce it with the `sl-icon`
wrapper (rules in `base.css` — the multiplier is CSS, not per-icon markup):

```vue
<span class="sl-icon">
  <Icon name="streamline-sharp:user-single-neutral-male" />
</span>
```

- Size icons with `font-size` (they're `1em` square), matching the design's
  `.util-btn .sl-icon { font-size: 21px }` pattern — e.g. `class="sl-icon text-[21px]"`.
- Multicolor brand SVGs stay as files in `app/assets/icons` → `<Icon name="local:…" />`.
- Small chevrons/arrows the design hand-writes as inline `<svg>` stay inline SVG.

### Animations & transitions

- **Duration:** the design uses `.35s` for hovers/CTAs and `.15s`/`.22s` for small
  state changes (`--t-fast`, `--t-med`, `--t-slow` in `theme.css`) — match the element
  you're porting, don't pick a default.
- **Easing:** plain `ease` everywhere; it's already Tailwind's default timing function
  here, so `transition-*` utilities match without extra classes.
- Never hardcode `cubic-bezier(...)` manually.

## Design fidelity (porting from the static page)

`design/thornloe-farm-supply.html` is the source of UI truth.

- **Match the design exactly — read the real CSS, never approximate.** Open the actual
  rule for the element you're porting (the design's single inline `<style>` block,
  lines 9–1258) and reproduce its real values: size, weight, spacing, color, radius,
  every state. Don't fill in a "sensible default" from memory: if you haven't read the
  rule, you don't know it.
- **Design fidelity beats personal taste** — _unless_ the discrepancy is a genuine slip
  in the design itself (same component styled differently across views). Pixel-matching
  a bug is not the goal.
- **On inconsistency, stop and surface it — don't pick silently.** Show the divergence
  and propose a resolution:
  - **Volt component** and the divergent styles recur **>1×** → propose a new **variant/prop**
  - **Non-Volt** and it recurs **>1×** → propose extracting a **custom component**
  - **One-off** → inline it, no abstraction
- **Always design + verify mobile.** The design is **mobile-first** with `min-width`
  media queries (`sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280 / 1400) — port them as
  Tailwind's mobile-first variants, and check gutters, font sizes, grid columns,
  wrapping, overflow and tap targets at phone width.

### Assets

Images were extracted out of the design's inline `window.__resources` map into
`public/images/` (60 files); `../design/asset-manifest.json` maps each original resource
key / `assets/…` path to its new `/images/…` URL. When you port a section, look up its
image there rather than re-deriving it. The manifest lives with the design rather than
in `public/` — it is a porting aid, not something to serve.

- **Always `<NuxtImg>` with `format="webp"`.** IPX otherwise keeps the source format,
  and the design's cut-outs are PNGs: the same 600×600 product image is 500 KB as PNG
  and 65 KB as webp. Every image tag in the app goes through it, including the logo.
- Sources are capped at **1800px wide** (the tallest `width` any component asks for is
  900, so 2× displays are covered) and re-compressed — the set went 17.8 MB → 6.0 MB.
  Cap on _width_, never the long edge: the portrait heroes are cropped to landscape by
  `object-cover`, so their width is what has to survive.
- Don't re-encode a JPEG that's already the right size: ~10% off isn't worth a second
  generation of loss. PNGs quantize well (palette, 256 colours) — measure the error on
  **premultiplied** RGBA, since RGB under a zero alpha is arbitrary and a lossless
  re-encode legitimately rewrites it.

## Data & API

The backend is mocked in-process: Nitro route handlers under `server/api/` with
in-memory state (`server/utils/mock-*.ts`) and a deliberate 100–200 ms delay
(`server/middleware/mock-latency.ts`, `MOCK_LATENCY_MS=0` disables it). State resets
when the dev server restarts.

Section data the design kept in JS blobs (`CATEGORY_DATA`, `CATEGORY_SECTIONS`,
`PDP_*`, …) lives in typed modules under `app/shared/constants/` and is now the mock's
data source — components read it only through the API, never directly. Pointing at a
real backend is a base-URL change, not a component change.

Always use `useApi()` — never direct `$fetch` in components.

### The wire contract lives in `shared/`

`shared/types/{catalog,content,account}.ts` is the single definition of every response
shape, and Nuxt 4 exposes it to both sides as `#shared/types/…` — pages import from it,
and **every handler annotates its return type with it**:

```ts
export default defineEventHandler((): SiteResponse => ({ … }))
```

That annotation is the point of the layer: drop or rename a field and the build fails on
the side that's now wrong, instead of the page rendering blank. Don't re-declare a
response shape inline at a call site (`api<{ total: number, … }>`), and don't derive the
contract from the fixtures — the fixtures are checked against it (`ACCOUNT_PROFILE
satisfies ApiProfile`, `STORE_HOURS satisfies readonly StoreHours[]`), so a real backend
can replace them without the types moving.

Note the remaining inversion: `server/**` still imports fixture data from
`~/shared/constants/**` (app layer). It works and the fixtures do **not** reach the
client bundle (verified against `.output/public`), but when the real API arrives that
data should move to `server/` or `shared/`.

### Structured data (JSON-LD)

`useJsonld(getter)` injects a `<script type="application/ld+json">`; the builders in
`app/shared/utils/schema.ts` are pure and unit-tested (`test/schema.spec.ts`). Same split
as the ncs project. Currently emitted: Organization + the storefront (`HardwareStore`,
with the current season's opening hours parsed out of `STORE_HOURS`) site-wide from
`app.vue`, WebSite + SearchAction on the home page, Product + Offer and a BreadcrumbList
on the PDP, BreadcrumbList on `/categories`.

Absolute URLs come from `SITE.url` — **an assumption** derived from the contact email's
domain. Correct it there if the live domain differs. Still missing (deliberately, not
done yet): `<link rel=canonical>`, `og:image`, `robots.txt`, a sitemap.

### Loading states

Always use `VoltSkeleton` for client-side data fetching — never spinners as primary loading UI.

- Skeleton shape must match the actual content layout to avoid layout shift
- Size via `width`/`height` props — **not Tailwind classes** (PrimeVue applies inline style that overrides them)

```vue
<VoltSkeleton width="6rem" height="0.75rem" />
```

For a media placeholder, put the aspect ratio on a **wrapper** and let the skeleton
fill it. `height="0"` plus `aspect-[6/5]` collapses to nothing: the inline height wins
and `aspect-ratio` only computes a height when height is `auto`.

```vue
<div class="aspect-square w-full">
  <VoltSkeleton height="100%" />
</div>
```

**A skeleton only ever appears if its fetch is `{ lazy: true }`.** Without it Nuxt holds
the previous page until the data lands, so the `pending` branch never renders on a
client-side navigation (SSR is unaffected either way — the content is still server-rendered
for crawlers). Two shapes, picked per case:

- **Skeleton** when there's nothing to show yet — first entry to a listing, suggestions,
  the account panes, the brand strips.
- **Dim the stale content** (`:class="pending && items.length && 'opacity-60 transition-opacity'"`)
  when a set is already on screen and only being refined — shop re-filtering, category
  drill-down. Flashing skeletons on every filter click is worse than a 60% dim.

Content pages (`/services`, `/rentals`, `/tires`, `/about`, `/contact`, `/product/[id]`)
deliberately stay non-lazy: they arrive whole, which reads better than a page-shaped
placeholder.

## Forms

All forms use VeeValidate + Zod: Zod for schema/validation, VeeValidate for state binding.

```ts
// 1. Define schema (co-located in the feature's schemas/)
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

// 2. useForm
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
})

// 3. Bind fields
const [email, emailAttrs] = defineField('email')

// 4. Submit
const onSubmit = handleSubmit(async (values) => { ... })
```

- Infer types from schema with `z.infer<typeof schema>` — never define form types manually
- One schema per form, co-located in the feature's `schemas/`
- Use `.refine()` for cross-field validation; reuse with `.pick()`, `.extend()`, `.merge()`
- Never use the `required` HTML attribute — Zod handles all validation
- **Lazy validation** — errors appear only after submit, never on blur/input. Configured
  globally in `plugins/vee-validate.ts`; do not override per-field.

## Routing & Auth

The design is a client-side SPA with 16 `.view` divs; each becomes a real page.

```ts
// Public (storefront default) — no definePageMeta needed
// Protected (account) — gated explicitly per page
definePageMeta({ auth: true })
// Guest-only (login/register/forgot/reset)
definePageMeta({ auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' } })
```

- Never write inline `navigateTo()` guards in `<script setup>`
- All redirects and route guards go in `middleware/` — never inline

## Accessibility

- Use semantic elements: `<main>`, `<header>`, `<nav>`, `<aside>`, `<section>`, `<article>`
- One `<main>` per page; headings in logical order without skipping levels
- `<button>` for actions, `<a>` for navigation — never `<div @click>`
- Every `<img>` needs `alt`; decorative images: `alt=""`
- Form inputs must have an associated `<label>`
- `aria-label` on icon-only buttons
- `aria-live="polite"` for dynamic content updates

## Utilities

Before writing any helper, check existing project utilities: `shared/utils/` and
`shared/composables/` (both auto-imported). Then check
[vueuse.org](https://vueuse.org/functions) — `useElementSize`, `useStorage`,
`useClipboard`, `useToggle`, `useDebounce`, `useIntersectionObserver`,
`useMediaQuery`, `useScroll`, `useEventListener` cover most of what the design's
hand-written JS does.
