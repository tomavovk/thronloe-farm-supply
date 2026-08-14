import { useEventListener, useResizeObserver } from '@vueuse/core'

// Horizontal scroll-snap carousel with prev/next buttons and the design's
// progress bar: the fill's width is the visible fraction of the track and its
// left offset follows the scroll position. One step = one card + the 16px gap.
export const useCarousel = () => {
  const track = ref<HTMLElement | null>(null)
  const scrollLeft = ref(0)
  const scrollWidth = ref(0)
  const clientWidth = ref(0)

  const measure = () => {
    const el = track.value

    if (!el) {
      return
    }

    scrollLeft.value = el.scrollLeft
    scrollWidth.value = el.scrollWidth
    clientWidth.value = el.clientWidth
  }

  // The design hides the nav and the progress bar when nothing overflows.
  const overflows = computed(() => scrollWidth.value - clientWidth.value > 2)

  const visibleFraction = computed(() =>
    scrollWidth.value > 0 ? clientWidth.value / scrollWidth.value : 1,
  )

  const progress = computed(() => {
    const max = scrollWidth.value - clientWidth.value

    return max > 0 ? scrollLeft.value / max : 0
  })

  const fillStyle = computed(() => ({
    width: `${visibleFraction.value * 100}%`,
    left: `${progress.value * (1 - visibleFraction.value) * 100}%`,
  }))

  const step = () => {
    const card = track.value?.firstElementChild

    return card ? card.getBoundingClientRect().width + 16 : 320
  }

  const scrollBy = (direction: -1 | 1) => {
    track.value?.scrollBy({ left: direction * step(), behavior: 'smooth' })
  }

  useEventListener(track, 'scroll', measure, { passive: true })
  useResizeObserver(track, measure)
  onMounted(measure)

  return {
    track,
    overflows,
    fillStyle,
    scrollBy,
    next: () => scrollBy(1),
    prev: () => scrollBy(-1),
  }
}
