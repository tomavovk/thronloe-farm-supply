import type { SiteResponse } from '#shared/types/content'
import { DELIVERY_SCHEDULE, PHONE_EXTENSIONS, SITE, STORE_HOURS } from '~/shared/constants/site'

// Store details (phone, address, hours, delivery days) come from GET /site. The
// announce bar, the footer and the contact cards all read them, so one shared
// useAsyncData key means one request per render, not one per component.
//
// The constants stay as the fallback: this is chrome on every page, and blanking
// the footer because a request failed would be worse than showing known-good text.
const FALLBACK: SiteResponse = {
  name: SITE.name,
  legalName: SITE.legalName,
  tagline: SITE.tagline,
  address: SITE.address,
  addressLines: [...SITE.addressLines],
  extensions: PHONE_EXTENSIONS,
  phone: SITE.phone,
  phoneHref: SITE.phoneHref,
  email: SITE.email,
  facebookUrl: SITE.facebookUrl,
  logo: SITE.logo,
  delivery: DELIVERY_SCHEDULE,
  hours: STORE_HOURS,
}

export const useSite = () => {
  const api = useApi()

  const { data } = useAsyncData('site', () => api<SiteResponse>('/site'), {
    default: () => FALLBACK,
  })

  return { site: computed(() => data.value ?? FALLBACK) }
}
