# Thronloe Farm Supply

E-commerce website for Thronloe Farm Supply — a family-run farm supply store in Thronloe, Ontario. New build, started July 2026.

This repository holds the HTML design prototypes reviewed on the EBMS Client Platform.

## Look & feel

Light, white, and clean — imagery carries the page. Signature layout is alternating image / text-beside blocks with short copy. Sticky white navigation with category dropdowns; Search / Account / Cart top-right; phone number and social icons in the header.

## Contents

| File | Description |
|---|---|
| `Thronloe Farm Supply.html` | Design prototype — **Home** page |

The `.html` file is a single self-contained bundle: images and fonts are embedded, so it opens directly in any browser with no server or build step. Just double-click it (JavaScript must be enabled).

## Status

- ✅ **Home** — hero, category tiles, alternating image/text blocks (About, Delivery, Events, Featured), FAQ, CTA, footer
- ⬜ Shop / catalog
- ⬜ Product detail
- ⬜ Cart + Checkout (mock 360 Payments flow)
- ⬜ Events
- ⬜ About
- ⬜ Contact
- ⬜ Account / login

## Conventions

Built following the shared `ebms-design` guidelines (single self-contained `.html`, unique `data-comment` on every visible element, `:root` design tokens, SPA `navigate()` pattern, mobile-first Tailwind breakpoints). Prototypes are designed to later convert to Vite + React Query + TanStack Router + shadcn/ui + Tailwind.
