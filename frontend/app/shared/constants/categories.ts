// Category browsing tree with artwork (design CATEGORY_SECTIONS). Separate from
// `navigation.ts`, which carries the same names without images: the nav menus are
// text-only, the /categories page is a card grid.

export interface CategoryCard {
  name: string
  image: string
}

export interface CategorySection extends CategoryCard {
  subs: CategoryCard[]
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    name: 'Feed',
    image: '/images/cat-livestock-feed-2.png',
    subs: [
      { name: 'Beef', image: '/images/cat-livestock-feed-2.png' },
      { name: 'Dairy', image: '/images/feed-bag.png' },
      { name: 'Swine', image: '/images/cat-livestock-feed-2.png' },
      { name: 'Horses', image: '/images/cat-pet.png' },
      { name: 'Sheep', image: '/images/feed-bag.png' },
      { name: 'Goats', image: '/images/cat-livestock-feed-2.png' },
      { name: 'Poultry', image: '/images/cat-chicks.png' },
    ],
  },
  {
    name: 'Farm Supply',
    image: '/images/cat-barn-frame-3.png',
    subs: [
      { name: 'Poultry Supplies', image: '/images/cat-chicks.png' },
      { name: 'Barn Supplies', image: '/images/cat-barn-frame-3.png' },
      { name: 'Horse Supplies', image: '/images/cat-pet.png' },
      { name: 'Vet Supplies', image: '/images/cat-tools-2.png' },
      { name: 'Feeders & Troughs', image: '/images/cat-barn.png' },
      { name: 'Bale Wrap', image: '/images/cat-trailer-2.png' },
      { name: 'Baler Twine', image: '/images/cat-tools.png' },
      { name: 'Heated Waterbowls', image: '/images/cat-barn-frame.png' },
    ],
  },
  {
    name: 'Field & Yard',
    image: '/images/cat-garden-2.png',
    subs: [
      { name: 'Chick Orders', image: '/images/cat-chicks.png' },
      { name: 'Seed', image: '/images/cat-garden-2.png' },
      { name: 'Fencing & Gates', image: '/images/cat-fencing-2.png' },
    ],
  },
  {
    name: 'Equipment',
    image: '/images/cat-tools-2.png',
    subs: [
      { name: 'New Equipment', image: '/images/cat-tools-2.png' },
      { name: 'Used Equipment', image: '/images/service-tractor.png' },
    ],
  },
]

export const findCategorySection = (name: string | undefined) =>
  CATEGORY_SECTIONS.find((section) => section.name === name)
