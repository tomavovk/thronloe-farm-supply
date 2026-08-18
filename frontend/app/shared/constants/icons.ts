// Every Streamline Sharp icon the design uses, in one list.
//
// Two jobs at once: it types <SlIcon name="…"> and it feeds @nuxt/icon's
// clientBundle (see nuxt.config). The bundle matters — @nuxt/icon otherwise
// fetches icon data over a relative URL, which has no host during SSR, so icons
// render as empty <svg> until hydration. Bundled icons are registered
// synchronously on both sides instead.
//
// Porting a page that needs a new icon? Add its Streamline Sharp name here.
export const DESIGN_ICONS = [
  'calendar-mark',
  'help-chat-2',
  'leaf',
  'magnifying-glass',
  'phone-ringing-1',
  'screwdriver-wrench',
  'store-2',
  'transfer-truck-time',
  'user-single-neutral-male',
] as const

export type DesignIcon = (typeof DESIGN_ICONS)[number]
