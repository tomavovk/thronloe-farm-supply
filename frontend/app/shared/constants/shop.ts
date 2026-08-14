// Shop listing configuration (design: SHOP_PER_PAGE + the #shopSort options).

export const SHOP_PER_PAGE = 12

/** The search page shows a denser 4-up grid, so it pages later (design). */
export const SEARCH_PER_PAGE = 16

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const

export type ShopSort = (typeof SORT_OPTIONS)[number]['value']

/** Section shown when no category is requested (design: currentShopCategory). */
export const DEFAULT_SHOP_CATEGORY = 'Feed'
