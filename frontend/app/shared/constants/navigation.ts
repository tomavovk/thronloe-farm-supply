// Navigation model. The design duplicates this tree in three places (desktop
// mega panel, mobile accordion, footer columns); here it is declared once.

export interface NavLink {
  label: string
  to: string
}

export interface ShopSection {
  name: string
  items: string[]
}

export const SHOP_SECTIONS: ShopSection[] = [
  {
    name: 'Feed',
    items: ['Beef', 'Dairy', 'Swine', 'Horses', 'Sheep', 'Goats', 'Poultry'],
  },
  {
    name: 'Farm Supply',
    items: [
      'Poultry Supplies',
      'Barn Supplies',
      'Horse Supplies',
      'Vet Supplies',
      'Feeders & Troughs',
      'Bale Wrap',
      'Baler Twine',
      'Heated Waterbowls',
    ],
  },
  {
    name: 'Field & Yard',
    items: ['Chick Orders', 'Seed', 'Fencing & Gates'],
  },
  {
    name: 'Equipment',
    items: ['New Equipment', 'Used Equipment', 'Loader Attachments'],
  },
]

// Route for a whole shop section ("See all feed").
export const shopSectionRoute = (section: string) => ({
  path: '/shop',
  query: { category: section },
})

// Route for one item inside a section. These links are inert in the static
// design (`onclick="return false"`), so the item rides along as `sub` for the
// shop page to filter on.
export const shopItemRoute = (section: string, item: string) => ({
  path: '/shop',
  query: { category: section, sub: item },
})

// Primary nav, after the Shop mega-menu trigger.
export const MAIN_NAV: NavLink[] = [
  { label: 'Services', to: '/services' },
  { label: 'Rentals', to: '/rentals' },
  { label: 'Tires', to: '/tires' },
  { label: 'Events', to: '/events' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Store',
    links: [
      { label: 'All Categories', to: '/categories' },
      ...SHOP_SECTIONS.map((s) => ({
        label: s.name,
        to: `/shop?category=${encodeURIComponent(s.name)}`,
      })),
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Service', to: '/services' },
      { label: 'Rentals', to: '/rentals' },
      { label: 'Tires', to: '/tires' },
    ],
  },
  {
    title: 'Info',
    links: [
      { label: 'Events', to: '/events' },
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Account', to: '/account' },
    ],
  },
]
