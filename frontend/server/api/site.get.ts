import type { SiteResponse } from '#shared/types/content'
import { DELIVERY_SCHEDULE, PHONE_EXTENSIONS, SITE, STORE_HOURS } from '~/shared/constants/site'

// Store identity used by the announce bar, the footer and the contact cards.
export default defineEventHandler((): SiteResponse => ({
  name: SITE.name,
  legalName: SITE.legalName,
  tagline: SITE.tagline,
  address: SITE.address,
  addressLines: SITE.addressLines,
  extensions: PHONE_EXTENSIONS,
  phone: SITE.phone,
  phoneHref: SITE.phoneHref,
  email: SITE.email,
  facebookUrl: SITE.facebookUrl,
  logo: SITE.logo,
  delivery: DELIVERY_SCHEDULE,
  hours: STORE_HOURS,
}))
