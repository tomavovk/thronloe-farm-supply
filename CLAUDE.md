# Thornloe Farm Supply

E-commerce catalogue site for a farm-supply store in Thornloe, Ontario. The whole
application lives in **`frontend/`** — a Nuxt 4 storefront with an in-process mock
API. There is no backend yet.

> **It's a catalogue, not a store.** Cart, checkout and payments were deliberately
> removed: a product page shows the price plus a "Contact us" action, and the
> account area keeps order history only. Don't reintroduce cart/checkout concepts.

## Where to work

- All code, config and assets: `frontend/` — **read `frontend/CLAUDE.md` before
  changing anything there** (conventions, Volt/PrimeVue rules, design tokens,
  loading states, forms). Volt components have their own landmine list in
  `frontend/app/shared/volt/CLAUDE.md`.
- The original static design (`design/thornloe-farm-supply.html`) has been fully
  ported and deleted. The app itself is now the source of UI truth; the design
  file survives in git history if a historical value is ever needed.

## Environment & commands

Node 22 via `fnm` — prefix every `node`/`npm`/`nuxt` invocation:

```sh
cd frontend
eval "$(fnm env)" && fnm use 22
npm run dev        # http://localhost:3000 (MOCK_LATENCY_MS=0 disables mock delay)
npm run lint       # ESLint
npm run format     # Prettier (format:check in CI)
npm run typecheck  # vue-tsc — keep at 0 errors
npm test           # vitest
```

CI (`.github/workflows/ci.yml`) runs lint → format:check → typecheck → test →
build on every push/PR. All four gates are green — keep them that way.

## Mock API test user

The account area (`/account`) is gated; the mock API seeds one user:

- **Email:** `admin@example.com`
- **Password:** `String1!`

Mock state is in-memory (`frontend/server/utils/mock-state.ts`) and resets on every
dev-server restart.
