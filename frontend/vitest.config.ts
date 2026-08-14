import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // Default — node (fast, for pure functions/composables).
    // Component tests opt into the Nuxt environment via a per-file comment:
    //   // @vitest-environment nuxt
    environment: 'node',
  },
  // Node-environment tests don't get Nuxt's aliases for free: `~` is srcDir,
  // `#shared` is the app/server contract layer.
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
})
