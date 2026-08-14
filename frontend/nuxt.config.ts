import tailwindcss from '@tailwindcss/vite'
import { DESIGN_ICONS } from './app/shared/constants/icons'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@sidebase/nuxt-auth'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      titleTemplate: '%s — Thornloe Farm Supply',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }],
    },
  },

  nitro: {
    preset: 'node-server',
  },

  routeRules: {
    // The account screens are gated by a token the server never sees, so the
    // client always redirects or refetches on arrival. Rendering them on the
    // server buys nothing and guarantees a hydration mismatch.
    '/account': { ssr: false },
  },

  runtimeConfig: {
    public: {
      // Defaults to the same-origin mock API in server/api. Point it at the real
      // backend once there is one, then delete server/api.
      apiBaseUrl: process.env.API_BASE_URL || '/api',
    },
  },

  // Feature-module auto-imports: features keep their code co-located.
  // `extensions: ['vue']` because the scanner otherwise treats plain modules as
  // components too — two feature `types.ts` files both claimed the name `Types`.
  components: [
    { path: '~/shared/volt', prefix: 'Volt', extensions: ['vue'] },
    { path: '~/features', pathPrefix: false, extensions: ['vue'] },
    { path: '~/components', pathPrefix: false, extensions: ['vue'] },
  ],

  imports: {
    dirs: ['shared/composables', 'shared/utils', 'shared/constants', 'features/**/composables'],
  },

  // The design draws every icon from Streamline Sharp (Iconify `streamline-sharp`),
  // rendered at 1.35× stroke width — see the `sl-icon` rules in base.css.
  // Local multicolor brand SVGs (kept as-is) → <Icon name="local:…" />.
  icon: {
    // Inline <svg> rather than @nuxt/icon's default CSS-mask mode: the design
    // sizes icons as 1em-square SVGs and thickens their strokes 1.35× via CSS
    // (see `.sl-icon` in base.css) — neither works on a masked background.
    mode: 'svg',
    serverBundle: { collections: ['streamline-sharp'] },
    // Bundle the design's icon set so it resolves synchronously during SSR too
    // (see app/shared/constants/icons.ts). Auto-scanning can't see them: <SlIcon>
    // builds the full name at runtime.
    clientBundle: { icons: DESIGN_ICONS.map((name) => `streamline-sharp:${name}`) },
    customCollections: [{ prefix: 'local', dir: './app/assets/icons' }],
  },

  // Storefront is public — gate account pages explicitly via definePageMeta.
  // No backend yet: endpoints mirror the shape we expect and stay dormant until
  // API_BASE_URL points at a real API.
  auth: {
    baseURL: process.env.API_BASE_URL,
    originEnvKey: 'API_BASE_URL',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/token/invalidate', method: 'post' },
        getSession: { path: '/user/me', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        cookieName: 'auth.token',
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 60,
        sameSiteAttribute: 'lax',
      },
      pages: {
        login: '/login',
      },
      session: {
        dataResponsePointer: '/user',
      },
    },
    sessionRefresh: {
      enableOnWindowFocus: false,
    },
    globalAppMiddleware: false,
  },

  // Two tools, two jobs, no overlap: Prettier owns formatting (`npm run format`),
  // ESLint owns correctness and the Vue/TS rules. Stylistic rules stay off because
  // they fight Prettier directly — @stylistic/arrow-parens wants `x => x` where
  // Prettier writes `(x) => x`, and each "fix" reintroduces the other's error.
  eslint: {
    config: {
      stylistic: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
