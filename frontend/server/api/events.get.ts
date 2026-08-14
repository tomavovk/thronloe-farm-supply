import type { EventsResponse } from '#shared/types/content'
import { EVENTS } from '~/shared/constants/content'

// GET /api/events — chick delivery dates and the Fur & Feather day.
export default defineEventHandler((): EventsResponse => ({ items: EVENTS }))
